import React from "react";
import styles from "./DailyTrend.module.css";
import moment from "moment";

interface CurrencyHistory {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

interface DailyTrendProps {
  currencyHistory: CurrencyHistory[];
}

const DailyTrend: React.FC<DailyTrendProps> = ({ currencyHistory }) => {
  return (
    <section className={styles.dailyTrend}>
      <header className={styles.dailyTrend__title}>
        <h1>Daily Trend</h1>
      </header>

      <div className={styles.dailyTrend__table}>
        <div className={styles.dailyTrend__tableTitles}>
          <div
            className={`${styles.dailyTrend__tableTitlesColumn} ${styles.dailyTrend__tableTitlesColumnDate}`}
          >
            Date
          </div>
          <div
            className={`${styles.dailyTrend__tableTitlesColumn} ${styles.dailyTrend__tableTitlesColumnRight}`}
          >
            Open
          </div>
          <div
            className={`${styles.dailyTrend__tableTitlesColumn} ${styles.dailyTrend__tableTitlesColumnRight}`}
          >
            Close
          </div>
          <div
            className={`${styles.dailyTrend__tableTitlesColumn} ${styles.dailyTrend__tableTitlesColumnRight}`}
          >
            Difference
          </div>
        </div>
        <div className={styles.dailyTrend__tableRows}>
          {currencyHistory.map((data) => {
            const difference =
              Number.parseFloat(data.close) - Number.parseFloat(data.open);
            const differenceSign = Math.sign(difference);
            const formattedDifference =
              differenceSign >= 0
                ? `+${difference.toFixed(4)}`
                : `${difference.toFixed(4)}`;

            const differenceClassName =
              differenceSign >= 0
                ? styles.dailyTrend__green
                : styles.dailyTrend__red;

            return (
              <div key={data.date} >
                <div className={styles.dailyTrend__tableRow}>
                  <div
                    className={`${styles.dailyTrend__tableRowColumn} ${styles.dailyTrend__tableRowColumnDate}`}
                  >
                    {moment(data.date).format("MMM-DD-YYYY")}
                  </div>
                  <div
                    className={`${styles.dailyTrend__tableRowColumn} ${styles.dailyTrend__tableRowColumnRight}`}
                  >
                    {Number.parseFloat(data.open).toFixed(4)}
                  </div>
                  <div
                    className={`${styles.dailyTrend__tableRowColumn} ${styles.dailyTrend__tableRowColumnRight}`}
                  >
                    {Number.parseFloat(data.close).toFixed(4)}
                  </div>
                  <div
                    className={`${styles.dailyTrend__tableRowColumn} ${styles.dailyTrend__tableRowColumnRight} ${differenceClassName}`}
                  >
                    {formattedDifference}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DailyTrend;
