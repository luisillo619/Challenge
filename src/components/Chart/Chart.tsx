import moment from "moment";
import React, { useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Brush,
} from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";

interface CurrencyHistory {
  [key: string]: string;
}

interface ChartComponentProps {
  currencyHistory: CurrencyHistory;
}

interface HistoryDataItem {
  date: string;
  close: number;
}

interface CustomTooltipProps {
  active: boolean;
  payload: Payload[];
  label: string;
}

interface Info {
  "4. close": string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ currencyHistory }) => {
  const historyData: HistoryDataItem[] = Object.entries(currencyHistory)
    .reverse()
    .map(([date, info]) => {
      const typedInfo = info as unknown as Info;
      return {
        date,
        close: parseFloat(typedInfo["4. close"]),
      };
    });

  const [data] = useState<HistoryDataItem[]>(historyData);

  const getPriceDomain = (): [number, number] => {
    const minPrice = Math.min(...data.map((item) => item.close));
    const maxPrice = Math.max(...data.map((item) => item.close));
    const padding = (maxPrice - minPrice) * 0.1;
    return [minPrice - padding, maxPrice + padding];
  };

  const dataWithFullBar = data.map((item) => ({
    ...item,
    fullBar: getPriceDomain()[1],
  }));

  const formatYAxisTicks = (tick: number): string => tick.toFixed(3);

  const formatDate = (dateString: string): string => {
    return moment(dateString).format("MMM D");
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Date: ${label}`}</p>
          <p className="intro">{`Close: ${payload[0].value.toFixed(3)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart
        data={dataWithFullBar}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          style={{ fontSize: "10px" }}
        />
        <YAxis
          domain={getPriceDomain()}
          tickFormatter={formatYAxisTicks}
          orientation="right"
        />
        <Tooltip // evita errores de typescript, de todos modos estos datos no los toma en cuenta customTooltip
          content={<CustomTooltip active={false} payload={[]} label={""} />}
        />
        {/* <Legend /> */}
        <Bar dataKey="fullBar" fill="#8884d8" barSize={20} opacity={0.2} />
        <Line type="monotone" dataKey="close" stroke="#ff7300" />
        <Brush
          dataKey="date"
          height={30}
          stroke="#ff7300"
          startIndex={data.length - 25}
          endIndex={data.length - 1}
          tickFormatter={formatDate}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default React.memo(ChartComponent);
