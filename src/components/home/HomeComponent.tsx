import React from "react";
import CurrencyExchange from "./currency/currencyExchange/CurrencyExchange";
import WebSocketComponent from "./socket/WebSocket";
import HistoricPrice from "./currency/historicPrice/HistoricPrice";
import { NextPage } from "next";
import DailyTrend from "./currency/dailyTrend/DailyTrend";
import styles from "./HomeComponent.module.css";
import Chart from "./chart/Chart";

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
  error?: string;
}

const HomeComponent: NextPage<HomePageProps> = ({
  currencyHistory,
  pair,
  error,
}) => {
  return (
    <>
      {currencyHistory && pair ? (
        <div className={styles.home}>
          <div className={styles.home__content}>
            <div className={styles.home__currencyExchange}>
              <CurrencyExchange pair={pair} />
            </div>
            <div className={styles.home__webSocket}>
              <WebSocketComponent pair={pair} />
            </div>

            <div className={styles.home__historicDaily}>
              <HistoricPrice currencyHistory={currencyHistory} />
              <DailyTrend currencyHistory={currencyHistory} />
            </div>
            <div className={styles.home__chart}>
              <Chart currencyHistory={currencyHistory} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.home__only}>
          <h1>{error ? error : null}</h1>

          <div className={styles.home__only_CurrencyExchange}>
            <CurrencyExchange pair={pair} />
          </div>
        </div>
      )}
    </>
  );
};

export default HomeComponent;
