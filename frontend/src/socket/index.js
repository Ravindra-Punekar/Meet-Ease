// import {io} from 'socket.io-client';

// export const socketInit = () => {
//     const options = {
//         'force new connection': true,
//         reconnectionAttempts: 'Infinity',
//         timeout: 10000,
//         transports: ['websocket'],
//     };

//     return io('http://localhost:5500', options);
// }

import { io } from 'socket.io-client';

export const socketInit = () => {
  const options = {
    'force new connection': true,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
    reconnectionDelay: 5000, // Set the reconnection delay to 5 seconds (5000 milliseconds)
  };

  const socket = io('http://localhost:5500', options);

  let reconnectTimer; // Define a timer variable

  socket.on('connect', () => {
    console.log('WebSocket connection established');
    // Clear the timer if the connection is re-established
    clearTimeout(reconnectTimer);
  });

  socket.on('disconnect', () => {
    console.error('WebSocket connection closed due to disconnect');

    // Set a timer to redirect to the home page after 5 seconds
    reconnectTimer = setTimeout(() => {
      window.location.href = '/'; // Redirect to the home page
    }, 5000); // 5000 milliseconds (5 seconds) delay
  });

  return socket;
};
