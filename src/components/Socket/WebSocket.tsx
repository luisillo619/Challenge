import { useEffect, useRef, useState } from "react";

interface WebSocketComponentProps {
  pair: string;
}

interface CurrencyData {
  [key: string]: string;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({ pair }) => {
  const ws = useRef<WebSocket | null>(null);
  const [currencyData, setCurrencyData] = useState<CurrencyData>({});

  const connectWebSocket = () => {
    // Desconectar el WebSocket actual si existe
    if (ws.current) {
      // des subscribirse del anterior
      let key = Object.keys(currencyData); // EUR-USD

      ws.current.send(
        JSON.stringify({
          action: "unsubscribe",
          pair: key[0],
        })
      );
      ws.current.close();
    }

    const handleSocketMessage = (event: MessageEvent) => {
      const message = event.data;

      if (!message.startsWith("{")) {
        console.log("Invalid message:", message);
        return;
      }

      console.log(message);

      try {
        const messageData = JSON.parse(message);
        setCurrencyData({
          [messageData.currency]: messageData.point,
        });
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    ws.current = new WebSocket("ws://67.205.189.142:8000/websockets/");
    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({ action: "subscribe", pair }));
    };
    ws.current.onmessage = handleSocketMessage;

    // FALTA EL MANEJO POR SI SE CIERRA
    ws.current.onclose = () => {
      console.log("WebSocket closed");
      
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      ws.current?.close();
    };
  }, [pair]);

  return (
    <>
      {Object.entries(currencyData).map(([currency, point]) => (
        <div key={currency}>
          {currency}: {point}
        </div>
      ))}
    </>
  );
};

export default WebSocketComponent;
