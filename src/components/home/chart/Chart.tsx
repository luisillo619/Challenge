import React, { Fragment, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import moment from "moment";
import styles from "./Chart.module.css";

interface CurrencyHistory {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

interface ChartComponentProps {
  currencyHistory: CurrencyHistory[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const date = moment(payload[0].payload.date).format("MMM D");
    const closingPrice = payload[0].payload.close;
    const openingPrice = payload[0].payload.open;

    return (
      <div className="custom-tooltip">
        <p className="label">{`Date: ${date}`}</p>
        <p className="label">{`Close: ${closingPrice}`}</p>
        <p className="label">{`Open: ${openingPrice}`}</p>
      </div>
    );
  }

  return null;
};

const ChartComponent: React.FC<ChartComponentProps> = ({ currencyHistory }) => {
  const reversedCurrencyHistory = useMemo(
    () => [...currencyHistory].reverse(),
    [currencyHistory]
  );
  const formattedCurrencyHistory = useMemo(
    () =>
      reversedCurrencyHistory.map((entry) => ({
        ...entry,
        close: parseFloat(entry.close),
      })),
    [reversedCurrencyHistory]
  );

  const monthLines = useMemo(() => {
    const monthIndices: number[] = [];
    let lastMonth = moment(formattedCurrencyHistory[0].date).month();

    formattedCurrencyHistory.forEach((entry, index) => {
      const currentMonth = moment(entry.date).month();
      if (currentMonth !== lastMonth) {
        monthIndices.push(index);
        lastMonth = currentMonth;
      }
    });

    if (monthIndices[0] !== 0) {
      monthIndices.unshift(0);
    }

    return monthIndices.map((index) => {
      const month = moment(formattedCurrencyHistory[index].date).format("MMM");
      return (
        <Fragment key={index}>
          <ReferenceLine
            x={formattedCurrencyHistory[index].date}
            stroke="#777777"
            label={{
              position: "bottom",
              value: month,
              fill: "#FFFFFF",
              dy: 5,
              dx: 15,
            }}
          />
        </Fragment>
      );
    });
  }, [formattedCurrencyHistory]);

  const yDomain = useMemo(() => {
    const prices = formattedCurrencyHistory.map((entry) => entry.close);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const lowerLimit = minPrice * 0.9;
    const upperLimit = maxPrice * 1.1;
    return [lowerLimit, upperLimit];
  }, [formattedCurrencyHistory]);

  const lastClosePrice = useMemo(() => {
    const lastEntry =
      formattedCurrencyHistory[formattedCurrencyHistory.length - 1];
    return lastEntry.close;
  }, [formattedCurrencyHistory]);

  const generateCustomYTicks = (
    min: number,
    max: number,
    tickCount: number,
    lastPrice: number
  ): number[] => {
    const interval = (max - min) / (tickCount - 1);
    const ticks = Array.from(
      { length: tickCount },
      (_, i) => min + interval * i
    );
    const lastPriceIndex = ticks.findIndex((tick) => tick > lastPrice);

    if (lastPriceIndex === -1) {
      ticks.push(lastPrice);
    } else {
      ticks.splice(lastPriceIndex, 0, lastPrice);
    }

    return ticks;
  };

  const yAxisTicks = useMemo(() => {
    const tickCount = 6;
    return generateCustomYTicks(
      yDomain[0],
      yDomain[1],
      tickCount,
      lastClosePrice
    );
  }, [yDomain, lastClosePrice]);

  return (
    <div className={styles.chart}>
      <ResponsiveContainer>
        <LineChart
          data={formattedCurrencyHistory}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 40,
          }}
        >
          <XAxis dataKey="date" hide />
          <YAxis
            domain={yDomain}
            orientation="right"
            tickFormatter={(tick) => tick.toFixed(2)}
            ticks={yAxisTicks}
            style={{ fontSize: "10px" }}
            width={20}
          />
          <CartesianGrid horizontal={true} vertical={false} />
          <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
          {monthLines}
          <Line
            type="monotone"
            dataKey="close"
            stroke="#886516"
            isAnimationActive={false}
            dot={false}
          />
          {/* <Brush
            dataKey="date"
            height={12}
            stroke="#8884d8"
            travellerWidth={15}
            y={200}
          /> */}
          <ReferenceLine
            x={
              formattedCurrencyHistory[formattedCurrencyHistory.length - 1].date
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ChartComponent;
