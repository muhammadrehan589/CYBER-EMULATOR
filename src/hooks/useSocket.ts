'use client';
// Single shared socket hook. All components that need real-time
// communication use this — never call io() directly in a component.

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(empId: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      `http://${window.location.hostname}:3001`;

    const s = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      setIsConnected(true);
      // Register this user with the socket server once connected
      if (empId) {
        s.emit('register', empId);
      }
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      s.disconnect();
    };
  }, [empId]); // Re-connect if empId changes

  return { socket, isConnected };
}
