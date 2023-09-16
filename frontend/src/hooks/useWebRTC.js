import { useEffect, useRef, useCallback } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket";
import { ACTIONS } from "../actions";
import freeice from "freeice";


export const useWebRTC = (roomId, user) => {
  // useState callback will work same as useState. but when we update the state, it will call the callback function.
  //since useState does not have callback, we need to use useStateWithCallback custom hook
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const clientsRef = useRef([]);

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);

      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  //capture media
  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .catch((err) => {
          console.log(err);
        });
    };

    startCapture().then(() => {
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });

      //socket emit JOIN socket io
      socket.current.emit(ACTIONS.JOIN, {
        roomId,
        user,
      });
    });

    return () => {
      //Leaving the room
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          track.stop();
        });
        socket.current.emit(ACTIONS.LEAVE, { roomId });
      }
    };
  }, []);

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      //if already connected then give warning
      if (peerId in connections.current) {
        return console.warn(`Already connected with ${peerId}(${user.name})`);
      }

      //new peer connection
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      //handle new ice candidate
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          iceCandidate: event.candidate,
        });

        //HANDLE ON track on this connection
        connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
          addNewClient({ ...remoteUser, muted: true }, () => {
            const remoteAudioElement = audioElements.current[remoteUser.id];
            if (remoteAudioElement) {
              remoteAudioElement.srcObject = remoteStream;
            } else {
              let settled = false;
              const interval = setInterval(() => {
                if (remoteAudioElement) {
                  remoteAudioElement.srcObject = remoteStream;
                  settled = true;
                }
                if (settled) {
                  clearInterval(interval);
                }
              }, 1000);
            }
          });
        };
      };

      //add local track to remote connection
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      //create offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();

        await connections.current[peerId].setLocalDescription(offer);
        //send offer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, [clients]);

  //Handle ice candidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, iceCandidate }) => {
      if (iceCandidate) {
        connections.current[peerId].addIceCandidate(
          new RTCIceCandidate(iceCandidate)
        );
      }
    });

    //cleaning up
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  //Handle SDP
  useEffect(() => {
    const handleRemoteSDP = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      //if remote session description is an offer then create answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);

        //send answer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSDP);

    //cleaning up
    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  //Handle remove peer
  useEffect(() => {
    const handleRemovePeer = ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }

      delete connections.current[peerId];
      delete audioElements.current[userId];

      setClients((existingClients) =>
        existingClients.filter((client) => client.id !== userId)
      );
    };

    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    //cleaning up
    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  //Listen for mute/unmute
  useEffect(() => {
    // handle mute and unmute
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      console.log("muting", userId);
      setMute(true, userId);
    });

    socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
      console.log("unmuting", userId);
      setMute(false, userId);
    });

    const setMute = (mute, userId) => {
      const clientIdx = clientsRef.current
        .map((client) => client.id)
        .indexOf(userId);
      const allConnectedClients = JSON.parse(
        JSON.stringify(clientsRef.current)
      );
      if (clientIdx > -1) {
        allConnectedClients[clientIdx].muted = mute;
        setClients(allConnectedClients);
      }
    };
  }, []);
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  //Handling Mute
  const handleMute = (isMute, userId) => {
    let settled = false;
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        if (isMute) {
          socket.current.emit(ACTIONS.MUTE, {
            roomId,
            userId,
          });
        } else {
          socket.current.emit(ACTIONS.UNMUTE, {
            roomId,
            userId,
          });
        }
        settled = true;
      }
      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };

  return { clients, provideRef, handleMute };
};
