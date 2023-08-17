import React from "react";
import styles from "./Rooms.module.css";
import RoomCard from "../../components/shared/RoomCard/RoomCard";

// Dummy Data for Rooms
const rooms = [
    {
        id: 1,
        topic: 'Which framework best for frontend ?',
        speakers: [
            {
                id: 1,
                name: 'Ravi Punekar',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jalindar Mogal',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 3,
        topic: 'What’s new in machine learning?',
        speakers: [
            {
                id: 1,
                name: 'Ravi Punekar',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jalindar Mogal',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 4,
        topic: 'Why people use stack overflow?',
        speakers: [
            {
                id: 1,
                name: 'Ravi Punekar',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name:'Jalindar Mogal',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 5,
        topic: 'Artificial inteligence is the future?',
        speakers: [
            {
                id: 1,
                name: 'Ravi Punekar',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jalindar Mogal',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
];




const Rooms = () => {
  return (
    <>
      <div className="container">
        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All Voice Rooms</span>
            <div className={styles.searchBox}>
              <img src="/images/search-icon.png" alt="search" />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search"
              />
            </div>
          </div>
          <div className={styles.right}>
            <button className={styles.startRoomButton}>
              <img src="/images/add-room-icon.png" alt="add-room" />
              <span>Start Room</span>
            </button>
          </div>
        </div>

        <div className={styles.roomsList}>
          {/* <div className={styles.roomCard}></div> */}
          {
            rooms.map((room) => ( 
              <>
              <RoomCard key={room.id} room={room} />
              <RoomCard key={room.id} room={room} />
              <RoomCard key={room.id} room={room} />
              <RoomCard key={room.id} room={room} />
              </>
            ))
          }
        </div>
      </div>
    </>
  );
};

export default Rooms;
