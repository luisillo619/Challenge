import { useRouter } from "next/router";
import React from "react";

interface CurrencyExchangeComponentProps {
  pair: string;
}

const CurrencyExchange: React.FC<CurrencyExchangeComponentProps> = ({
  pair,
}) => {
  const router = useRouter();
  let queryParams;

  const options = ["EURUSD", "EURCHF", "USDMXN", "CHFMXN"];

  const handlerClick = (option) => {
    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);
      if (queryParams.has("pair")) {
        queryParams.set("pair", option);
      } else {
        queryParams.append("pair", option);
      }
      const path = window.location.origin + "?" + queryParams.toString();
      router.push(path); // Cambiar router.push() a router.replace()
    }
  };

  const createButtons = () => {
    return options.map((option) => {
      if (option === pair) {
        return (
          <button onClick={() => handlerClick(pair)} className="active">
            {pair.slice(0, 3)}-{pair.slice(3, 6)}
          </button>
        );
      } else {
        return (
          <button onClick={() => handlerClick(option)} className="">
            {option.slice(0, 3)}-{option.slice(3, 6)}
          </button>
        );
      }
    });
  };

  return (
    <section>
      <div>{createButtons()}</div>
    </section>
  );
};

export default CurrencyExchange;

// rafcee
