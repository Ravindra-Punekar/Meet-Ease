import React, { useState, useEffect } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Room.module.css";
import { getRoom } from "../../http";

const Room = () => {
  const user = useSelector((state) => state.auth.user);
  const { id: roomId } = useParams();
  const [room, setRoom] = useState(null);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const navigate = useNavigate();
  const [isMuted, setMuted] = useState(true);
  
  useEffect(() => {
    const fetchRoom = async () => {
      const {data} = await getRoom(roomId);
      setRoom((prev) => data);
    };
  
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    handleMute(isMuted, user.id);
    // eslint-disable-next-line
}, [isMuted]);


  const handleManualLeave = () => {
    navigate("/rooms");
  };

  const handleMuteClick = (clientId) => {
    if(clientId !== user.id) return;
    setMuted((isMute)=>!isMute);
  }

  return (
    <div>
      <div className="container">
        <button onClick={handleManualLeave} className={styles.goBack}>
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>

      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          {room && <h2 className={styles.topic}>{room.topic}</h2>}
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button onClick={handleManualLeave} className={styles.actionBtn}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>

        <div className={styles.clientsList}>
          {clients.map((client, index) => { 
            return (
              <div className={styles.client} key={index}>
                <div className={styles.userHead}>
                  <img
                    className={styles.userAvatar}
                    src={client.avatar}
                    alt=''
                  />
                  <audio
                    autoPlay
                    ref={(instance) => provideRef(instance, client.id)}
                  ></audio>
                  <button onClick={()=>
                    handleMuteClick(client.id)} 
                    className={styles.micBtn}>
                    {client.muted ? (
                      <img src="/images/mic-mute.png" alt="mic-mute icon" />
                      ) : (
                      <img src="/images/mic.png" alt="mic icon" />
                    )}
                  </button>
                </div>
                <h4>{client.name}</h4>
                <h4>{index}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
