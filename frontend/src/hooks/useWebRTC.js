import { useEffect, useRef, useCallback } from 'react';
import { ACTIONS } from '../actions';
import {socketInit} from '../socket';
import freeice from 'freeice';
import { useStateWithCallback } from './useStateWithCallback';

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateWithCallback([]);
    const audioElements = useRef({});
    const connections = useRef({});
    const socket = useRef(null);
    const localMediaStream = useRef(null);
    const clientsRef = useRef(null);

    useEffect(() => {
        // console.log('render socketInit', 2);
        socket.current = socketInit();
    }, []);

    const addNewClient = useCallback(
        (newClient, cb) => {
            const lookingFor = clients.find(
                (client) => client.id === newClient.id
            );

            if (lookingFor === undefined) {
                setClients(
                    (existingClients) => [...existingClients, newClient],
                    cb
                );
            }
        },
        [clients, setClients]
    );

    useEffect(() => {
        // console.log('render clientsRef.current = clients', 3);
        clientsRef.current = clients;
    }, [clients]);

    useEffect(() => {
        // console.log('render startCapture', 4);
        const startCapture = async () => {
            // Start capturing local audio stream.
            localMediaStream.current =
                await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
        };

        startCapture().then(() => {
            // add user to clients list
            // console.log('render startCapture then', 5);
            addNewClient({ ...user, muted: true }, () => {
                // console.log('render add new client me', 6);
                const localElement = audioElements.current[user.id];
                
                if (localElement) {
                    localElement.volume = 1;
                    localElement.srcObject = localMediaStream.current;
                }
            });
            // console.log('render before ACTIONS.JOIN', 7);

            // Emit the action to join
            socket.current.emit(ACTIONS.JOIN, {
                roomId,
                user,
            });
        });

        // Leaving the room
        return () => {
            if(localMediaStream.current){
                localMediaStream.current
                .getTracks()
                .forEach((track) => track.stop());
                socket.current.emit(ACTIONS.LEAVE, { roomId });
            }
        };
    // eslint-disable-next-line
    }, []);
    // Handle new peer

    useEffect(() => {
        // console.log('render handle new peer useEffect', 8);
        const handleNewPeer = async ({
            peerId,
            createOffer,
            user: remoteUser,
        }) => {
            // If already connected then prevent connecting again
            // console.log('render inside handle new peer', 8);
            if (peerId in connections.current) {
                return console.warn(
                    `You are already connected with ${peerId} (${user.name})`
                );
            }

            // Store it to connections
            connections.current[peerId] = new RTCPeerConnection({
                iceServers: freeice(),
            });

            // Handle new ice candidate on this peer connection
            connections.current[peerId].onicecandidate = (event) => {
                socket.current.emit(ACTIONS.RELAY_ICE, {
                    peerId,
                    icecandidate: event.candidate,
                });
            };

            // Handle on track event on this connection
            connections.current[peerId].ontrack = ({
                streams: [remoteStream],
            }) => {
                addNewClient({ ...remoteUser, muted: true }, () => {
                    // console.log('render add new client remote', 9);
                    const currentUser = clientsRef.current.find(
                        (client) => client.id === user.id
                    );
                    if (currentUser) {
                        socket.current.emit(ACTIONS.MUTE_INFO, {
                            userId: user.id,
                            roomId,
                            isMute: currentUser.muted,
                        });
                    }
                    if (audioElements.current[remoteUser.id]) {
                        audioElements.current[remoteUser.id].srcObject =
                            remoteStream;
                    } else {
                        let settled = false;
                        const interval = setInterval(() => {
                            if (audioElements.current[remoteUser.id]) {
                                audioElements.current[remoteUser.id].srcObject =
                                    remoteStream;
                                settled = true;
                            }

                            if (settled) {
                                clearInterval(interval);
                            }
                        }, 300);
                    }
                });
            };

            // Add connection to peer connections track
            if(localMediaStream.current) {
            localMediaStream.current.getTracks().forEach((track) => {
                connections.current[peerId].addTrack(
                    track,
                    localMediaStream.current
                );
            });
            }
            
            // Create an offer if required
            if (createOffer) {
                const offer = await connections.current[peerId].createOffer();

                // Set as local description
                await connections.current[peerId].setLocalDescription(offer);

                // send offer to the server
                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: offer,
                });
            }
        };

        // Listen for add peer event from ws
        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
        return () => {
            socket.current.off(ACTIONS.ADD_PEER);
        };
        // eslint-disable-next-line
    }, []);

    // Handle ice candidate
    useEffect(() => {
        // console.log('render handle ice candidate out', 10);
        socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
            if (icecandidate) {
                connections.current[peerId].addIceCandidate(icecandidate);
            }
        });

        return () => {
            socket.current.off(ACTIONS.ICE_CANDIDATE);
        };
    }, []);

    // Handle session description

    useEffect(() => {
        // console.log('render set remote media', 11);
        const setRemoteMedia = async ({
            peerId,
            sessionDescription: remoteSessionDescription,
        }) => {
            connections.current[peerId].setRemoteDescription(
                new RTCSessionDescription(remoteSessionDescription)
            );

            // If session descrition is offer then create an answer
            if (remoteSessionDescription.type === 'offer') {
                const connection = connections.current[peerId];

                const answer = await connection.createAnswer();
                connection.setLocalDescription(answer);

                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: answer,
                });
            }
        };

        socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
        return () => {
            socket.current.off(ACTIONS.SESSION_DESCRIPTION);
        };
    }, []);

    useEffect(() => {
        // console.log('render handle remove peer out', 12);
        const handleRemovePeer = ({ peerId, userId }) => {
            // console.log('render inside handle remove peer out', 13);
            // Correction: peerID to peerId
            if (connections.current[peerId]) {
                connections.current[peerId].close();
            }

            delete connections.current[peerId];
            delete audioElements.current[peerId];
            setClients((list) => list.filter((c) => c.id !== userId));
        };

        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        return () => {
            for (let peerId in connections.current) {
                connections.current[peerId].close();
                delete connections.current[peerId];
                delete audioElements.current[peerId];
                // console.log('removing', connections.current);
            }
            socket.current.off(ACTIONS.REMOVE_PEER);
        };
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // handle mute and unmute
        // console.log('render inside mute useEffect', 14);
        socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
            handleSetMute(isMute, userId);
        });

        socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
            handleSetMute(true, userId);
        });

        socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
            handleSetMute(false, userId);
        });

        const handleSetMute = (mute, userId) => {
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
        // eslint-disable-next-line
    }, []);

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    };

    const handleMute = (isMute, userId) => {
        let settled = false;

        if (userId === user.id) {
            let interval = setInterval(() => {
                if (localMediaStream.current) {
                    localMediaStream.current.getTracks()[0].enabled = !isMute;
                    if (isMute) {
                        socket.current.emit(ACTIONS.MUTE, {
                            roomId,
                            userId: user.id,
                        });
                    } else {
                        socket.current.emit(ACTIONS.UNMUTE, {
                            roomId,
                            userId: user.id,
                        });
                    }
                    settled = true;
                }
                if (settled) {
                    clearInterval(interval);
                }
            }, 200);
        }
    };

   

    return {
        clients,
        provideRef,
        handleMute,
    };
};