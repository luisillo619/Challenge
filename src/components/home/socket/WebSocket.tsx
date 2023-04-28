import styles from "./WebSocket.module.css";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const WEBSOCKET_URL = "ws://67.205.189.142:8000/websockets/";
const RECONNECTION_INTERVAL = 4000;
const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
const DATE_FORMAT_MEDIA_QUERY = "DD/MM/YY HH:mm:ss";

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
  const [highest, setHighest] = useState<number | null>(null);
  const [lowest, setLowest] = useState<number | null>(null);
  const [initialPairState, setInitialPairState] = useState<boolean>(true);

  const createWebSocket = (): CustomWebSocket => {
    const socket = new WebSocket(WEBSOCKET_URL) as CustomWebSocket;
    return socket;
  };

  const handleMessage = (event: MessageEvent) => {
    const message = event.data;
    if (!message.startsWith("{")) return;
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
      setInitialPairState(true);
    };
  }, [pair]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 481px) and (max-width: 1024px)"
    );
    const updateDateFormat = () => {
      if (mediaQuery.matches) {
        setFormattedLastResponse(
          moment.utc(lastResponse).format(DATE_FORMAT_MEDIA_QUERY)
        );
      } else {
        setFormattedLastResponse(moment.utc(lastResponse).format(DATE_FORMAT));
      }
    };

    updateDateFormat(); 

    mediaQuery.addEventListener("change", updateDateFormat); 

    return () => {
      mediaQuery.removeEventListener("change", updateDateFormat); 
    };
  }, [lastResponse]);

  useEffect(() => {
    if (currencyData.point !== 0) {
      if (initialPairState) {
        // cada que hay un cambio en pair entra aqui en la primera vuelta
        setHighest(currencyData.point);
        setLowest(currencyData.point);
        setInitialPairState(false);
      } else {
        setHighest((prevHighest) =>
          prevHighest === null || currencyData.point > prevHighest
            ? currencyData.point
            : prevHighest
        );
        setLowest((prevLowest) =>
          prevLowest === null || currencyData.point < prevLowest
            ? currencyData.point
            : prevLowest
        );
      }
    }
  }, [currencyData.point, initialPairState]);

  return (
    <div className={styles.webSocketComponent}>
      <div className={styles.webSocketComponent__sectionPair}>
        <p className={styles.webSocketComponent__sectionTitlePair}>
          Currency Pair
        </p>
        <p className={styles.webSocketComponent__data}>{pair}</p>
      </div>
      <div className={styles.webSocketComponent__section}>
        <p className={styles.webSocketComponent__sectionTitle}>
          Current Exchange-Rate Today
        </p>
        <p
          className={`${styles.webSocketComponent__data} ${styles.webSocketComponent__currencyPoint}`}
        >
          {currencyData.point.toFixed(4)}
        </p>
      </div>
      <div className={styles.webSocketComponent__section}>
        <p className={styles.webSocketComponent__sectionTitle}>
          Highest Exchange-Rate Today
        </p>
        <p className={styles.webSocketComponent__data}>{highest?.toFixed(4)}</p>
      </div>
      <div className={styles.webSocketComponent__section}>
        <p className={styles.webSocketComponent__sectionTitle}>
          Lowest Exchange-Rate Today
        </p>
        <p className={styles.webSocketComponent__data}>{lowest?.toFixed(4)}</p>
      </div>
      <div className={styles.webSocketComponent__sectionLastUpdate}>
        <p className={styles.webSocketComponent__sectionTitle}>
          Last Update (UTC)
        </p>
        <p className={styles.webSocketComponent__data}>
          {formattedLastResponse}
        </p>
      </div>
    </div>
  );
};

export default WebSocketComponent;


