import React from "react";
import { useRouter } from "next/router";
import styles from "./CurrencyExchange.module.css";

interface CurrencyExchangeProps {
  pair: string;
}

const CurrencyExchange: React.FC<CurrencyExchangeProps> = ({ pair }) => {
  const router = useRouter();
  const currencyPairs = ["EURUSD", "EURCHF", "USDMXN", "CHFMXN"];

  const updateCurrencyPair = (selectedPair: string): void => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set("pair", selectedPair);
      const newPath = `${window.location.origin}?${queryParams.toString()}`;
      router.replace(newPath);
    }
  };

  const renderCurrencyPairButtons = (): JSX.Element[] => {
    return currencyPairs.map((currentPair) => {
      const isSelected = currentPair === pair;
      const buttonClassName = isSelected
        ? styles.currencyExchange__buttonPair_active
        : styles.currencyExchange__buttonPair_text;

      return (
        <button
          key={currentPair}
          onClick={() => updateCurrencyPair(currentPair)}
          className={`${styles.currencyExchange__buttonPair} ${buttonClassName}`}
          disabled={isSelected}
        >
          {currentPair.slice(0, 3)}-{currentPair.slice(3, 6)}
        </button>
      );
    });
  };

  return (
    <section className={styles.currencyExchange}>
      {renderCurrencyPairButtons()}
    </section>
  );
};

export default CurrencyExchange;