import React from "react";
import styles from "./HistoricPrice.module.css";
import moment from "moment";

interface CurrencyHistory {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

interface HistoricPriceProps {
  currencyHistory: CurrencyHistory[];
}

const HistoricPrice: React.FC<HistoricPriceProps> = ({ currencyHistory }) => {
  return (
    <section className={styles.historicPrice}>
      <header className={styles.historicPrice__title}>
        <h1>Historic Prices</h1>
      </header>

      <div className={styles.historicPrice__table}>
        <div className={styles.historicPrice__tableTitles}>
          <div
            className={`${styles.historicPrice__tableTitlesColumn} ${styles.historicPrice__tableTitlesColumnDate}`}
          >
            Date
          </div>
          <div
            className={`${styles.historicPrice__tableTitlesColumn} ${styles.historicPrice__tableTitlesColumnRight}`}
          >
            High
          </div>
          <div
            className={`${styles.historicPrice__tableTitlesColumn} ${styles.historicPrice__tableTitlesColumnRight}`}
          >
            Low
          </div>
        </div>
        <div className={styles.historicPrice__tableRows}>
          {currencyHistory.map((data) => (
            <div key={data.date}>
              <div className={styles.historicPrice__tableRowSeparator}>
                <div className={styles.historicPrice__tableRow}>
                  <div
                    className={`${styles.historicPrice__tableRowColumn} ${styles.historicPrice__tableRowColumnDate}`}
                  >
                    {moment(data.date).format("MMM-DD-YYYY")}
                  </div>
                  <div
                    className={`${styles.historicPrice__tableRowColumn} ${styles.historicPrice__tableRowColumnRight}`}
                  >
                    {Number.parseFloat(data.high).toFixed(3)}
                  </div>
                  <div
                    className={`${styles.historicPrice__tableRowColumn} ${styles.historicPrice__tableRowColumnRight}`}
                  >
                    {Number.parseFloat(data.low).toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoricPrice;
