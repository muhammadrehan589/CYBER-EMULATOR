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
        let isNewSession = false;
        if (typeof window !== 'undefined') {
          const lastLogged = localStorage.getItem('socket_visit_time_v4');
          const now = Date.now();
          if (!lastLogged || (now - parseInt(lastLogged)) > 60 * 60 * 1000) { // 1 hour cooldown
            isNewSession = true;
            localStorage.setItem('socket_visit_time_v4', now.toString());
          }
        }
        s.emit('register', empId, isNewSession);
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
