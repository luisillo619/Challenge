import React from "react";
import CurrencyExchange from "./currency/currencyExchange/CurrencyExchange";
import WebSocketComponent from "./socket/WebSocket";
import HistoricPrice from "./currency/historicPrice/HistoricPrice";
import { NextPage } from "next";
import DailyTrend from "./currency/dailyTrend/DailyTrend";
import styles from "./HomeComponent.module.css";

interface CurrencyHistory {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

interface HomePageProps {
  pair: string;
  currencyHistory: CurrencyHistory[];
}

const HomeComponent: NextPage<HomePageProps> = ({ currencyHistory, pair }) => {
  return (
    <div className={styles.homeComponent}>
      <div className={styles.homeComponent__content}>
        <div className={styles.currencyExchangeComponent}>
          <CurrencyExchange pair={pair} />
        </div>
        <div className={styles.webSocketComponent}>
          <WebSocketComponent pair={pair} />
        </div>

        <div className={styles.Historic_Daily_Components}>
          <HistoricPrice currencyHistory={currencyHistory} />
          <DailyTrend currencyHistory={currencyHistory} />
        </div>

        {/* <ChartComponent currencyHistory={currencyHistory} /> */}
      </div>
    </div>
  );
};

export default HomeComponent;
