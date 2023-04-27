import React, { Fragment } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Brush,
  CartesianGrid,
} from "recharts";
import moment from "moment";

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
    const closingPrice = payload[0].value;
    return (
      <div className="custom-tooltip">
        <p className="label">{`Fecha: ${date}`}</p>
        <p className="label">{`Precio de corte: ${closingPrice}`}</p>
      </div>
    );
  }

  return null;
};

const ChartComponent: React.FC<ChartComponentProps> = ({ currencyHistory }) => {
  const reversedCurrencyHistory = [...currencyHistory].reverse();
  const formattedCurrencyHistory = reversedCurrencyHistory.map((entry) => ({
    ...entry,
    close: parseFloat(entry.close),
  }));

  const renderMonthLines = () => {
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
            }}
          />
        </Fragment>
      );
    });
  };

  const renderLastPointReferenceLine = () => {
    const lastPoint =
      formattedCurrencyHistory[formattedCurrencyHistory.length - 1];
    return <ReferenceLine y={lastPoint.close} stroke="#776526" />;
  };

  return (
    <div style={{ height: 320, background: "black", width: "100%" }}>
      <ResponsiveContainer>
        <LineChart
          data={formattedCurrencyHistory}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 40,
          }}
        >
          <XAxis dataKey="date" hide />
          <YAxis
            domain={["dataMin", "dataMax"]}
            orientation="right"
            tickLine={false}
            axisLine={false}
          />
          <CartesianGrid
            horizontal={true}
            vertical={false}
            strokeDasharray="3 3"
          />
          <Tooltip content={<CustomTooltip />} />
          {renderMonthLines()}
          {renderLastPointReferenceLine()}
          <Line
            type="monotone"
            dataKey="close"
            stroke="#766526"
            isAnimationActive={false}
          />
          <Brush
            dataKey="date"
            height={12}
            stroke="#8884d8"
            travellerWidth={15}
            y={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ChartComponent;

