"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = new ClientIO(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      path: "/socket.io",
    });


    socketInstance.on('connect', () => {
      console.log('[SocketProvider] Connected to socket server');
    });

    socketInstance.on('disconnect', () => {
      console.log('[SocketProvider] Disconnected from socket server');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};