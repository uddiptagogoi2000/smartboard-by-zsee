import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

interface WebSocketContextType {
  data: Record<string, any>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  deviceId,
  children,
}: {
  deviceId: string;
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<Record<string, any>>({});
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log('Connecting to WebSocket...');
    ws.current = new WebSocket(`ws://zseeiot.in:8080?deviceId=${deviceId}`);

    ws.current.onopen = () => {
      console.log('WebSocket connected!');
    };

    ws.current.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        console.log('Received WebSocket Data:', receivedData);
        setData(receivedData);
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.current.onclose = (event) => {
      if (!event.wasClean) {
        console.warn(
          'WebSocket disconnected unexpectedly, attempting to reconnect...'
        );
        setTimeout(() => {
          setData({});
          ws.current = new WebSocket(
            `ws://zseeiot.in:8080?deviceId=${deviceId}`
          );
        }, 3000);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [deviceId]);

  return (
    <WebSocketContext.Provider value={{ data }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketData = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketData must be used within a WebSocketProvider');
  }
  return context.data;
};
