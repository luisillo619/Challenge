import ChartComponent from "@/components/Chart/Chart";
import axios from "axios";
import Head from "next/head";
import type { NextPage } from "next";
import WebSocketComponent from "@/components/Socket/WebSocket";

interface CurrencyHistory {
  [key: string]: string;
}

interface HomePageProps {
  pair: string;
  currencyHistory: CurrencyHistory;
}

const HomePage: NextPage<HomePageProps> = ({ pair, currencyHistory }) => {
  return (
    <>
      <Head>
        <title>Cicada Challenge</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Display the currency data */}
      <WebSocketComponent pair={pair} />
      <ChartComponent currencyHistory={currencyHistory} />
    </>
  );
};

export default HomePage;

export const getServerSideProps = async ({ query }: any) => {
  const { pair } = query;
  if (pair) {
    const { data: currencyHistory } = await axios(
      `http://67.205.189.142:8000/historic-data/${pair}`
    );
    console.log(currencyHistory["Time Series FX (Daily)"]);
    return {
      props: {
        currencyHistory: currencyHistory["Time Series FX (Daily)"],
        pair,
      },
    };
  }
  return {
    props: {
      pair: "EURUSD",
    },
  };
};
//