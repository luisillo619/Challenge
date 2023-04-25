import styles from "./WebSocket.module.css";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const WEBSOCKET_URL = "ws://67.205.189.142:8000/websockets/";
const RECONNECTION_INTERVAL = 4000;
const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

interface WebSocketComponentProps {
  pair: string;
}

interface CurrencyData {
  currency: string;
  point: number;
}

interface CustomWebSocket extends WebSocket {
  pair: string;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({ pair }) => {
  const socketRef = useRef<CustomWebSocket | null>(null);
  const [currencyData, setCurrencyData] = useState<CurrencyData>({
    currency: "",
    point: 0,
  });
  const [lastResponse, setLastResponse] = useState<number>(Date.now());
  const [formattedLastResponse, setFormattedLastResponse] =
    useState<string>("");

  const createWebSocket = (): CustomWebSocket => {
    const socket = new WebSocket(WEBSOCKET_URL) as CustomWebSocket;
    return socket;
  };

  const handleMessage = (event: MessageEvent) => {
    const message = event.data;
    if (!message.startsWith("{")) return;
    // console.log(message);
    const messageData = JSON.parse(message);
    setCurrencyData({
      currency: messageData.currency,
      point: messageData.point,
    });
    setLastResponse(Date.now());
  };

  const sendUnsubscribeMessage = (socket: CustomWebSocket) => {
    const message = JSON.stringify({
      action: "unsubscribe",
      pair: socket.pair,
    });
    socket.send(message);
  };

  const reconnect = (socket: CustomWebSocket | null) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      sendUnsubscribeMessage(socket);
      socket.close();
    }
    socketRef.current = null;
  };

  const subscribeToPair = (socket: CustomWebSocket, pair: string) => {
    const message = JSON.stringify({ action: "subscribe", pair });
    socket.send(message);
  };

  const setupWebSocket = (pair: string) => {
    const socket = createWebSocket();
    socket.pair = pair;

    socket.addEventListener("open", () => {
      subscribeToPair(socket, pair);
    });

    socket.addEventListener("message", handleMessage);
    socket.addEventListener("error", (error) => console.error("Error:", error));
    socket.addEventListener("close", (event) =>
      console.log("Conexión cerrada:", event.code, event.reason)
    );

    return socket;
  };

  useEffect(() => {
    const checkConnectionAndReconnect = () => {
      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        console.log("Reconectando...");
        reconnect(socketRef.current);
        socketRef.current = setupWebSocket(pair);
      }
    };

    socketRef.current = setupWebSocket(pair);

    const checkConnectionInterval = setInterval(
      checkConnectionAndReconnect,
      RECONNECTION_INTERVAL
    );

    return () => {
      clearInterval(checkConnectionInterval);
      if (socketRef.current) {
        socketRef.current.removeEventListener("message", handleMessage);
        reconnect(socketRef.current);
      }
    };
  }, [pair]);

  useEffect(() => {
    setFormattedLastResponse(moment.utc(lastResponse).format(DATE_FORMAT));
  }, [lastResponse]);

  return (
    <div className={styles.webSocketComponent}>
      <div className={styles.current}>
        <div className={styles.currency}>
          <p className={styles.currencyTitle}>Currency Pair</p>
          <p className={styles.currencyPair}>{pair}</p>
        </div>

        <div className={styles.point}>
          <p className={styles.datesTitle}>Current Exchange-Rate Today</p>
          <p className={styles.currencyPoint}>
            {Number(currencyData.point).toFixed(4)}{" "}
          </p>
        </div>

        <div className={styles.dates}>
          <p className={styles.datesTitle}>Highest Exchange-Rate Today</p>
          <p className={styles.datesPrice}>Alto</p>
        </div>

        <div className={styles.dates}>
          <p className={styles.datesTitle}>Lowest Exchange-Rate Today</p>
          <p className={styles.datesPrice}>Bajo</p>
        </div>

        <div className={styles.dates}>
          <p className={styles.datesTitle}>Last Update (UTC)</p>
          <p className={styles.datesPrice}>{formattedLastResponse}</p>
        </div>
      </div>
    </div>
  );
};

export default WebSocketComponent;

// cuando se utilizaba onmessage, las instancias no se eliminaban completamente porque el manejador de eventos seguía vinculado al socket, incluso después de llamar a socket.close(). Esto provocaba que los manejadores de eventos siguieran escuchando los eventos del socket cerrado, lo que podría causar problemas, como múltiples instancias activas y mensajes recibidos de pares de monedas anteriores.

// Ahora, al utilizar addEventListener y removeEventListener, puedes controlar mejor la vinculación y desvinculación de los manejadores de eventos. Antes de llamar a socket.close(), puedes eliminar explícitamente el manejador de eventos utilizando removeEventListener. De esta manera, el manejador de eventos se desvincula correctamente del socket antes de cerrarlo, lo que evita que se mantengan múltiples instancias activas del socket y garantiza que socket.close() funcione correctamente.
