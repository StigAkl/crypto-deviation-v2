import { Candle, Currency } from "../types";
const defaultDate = new Date(2000, 1, 1);
const endpoints = require("../constants/endpoints");
const axios = require("axios");

export const GetMarkets = async (): Promise<Currency[]> => {
  const result = await axios.get(endpoints.GET_MARKETS());

  const addedCurrencies: string[] = [];

  const filteredResults = result.data.result.filter(
    (market) => market.quoteVolume24h > 1800000
  );

  const markets: Currency[] = [];

  for (let i = 0; i < filteredResults.length; i++) {
    const element = filteredResults[i];
    if (
      element.name.includes("/") &&
      (element.name.includes("USD") || element.name.includes("USDT"))
    ) {
      const split = element.name.split("/");
      if (!addedCurrencies.includes(split[0])) {
        markets.push(element.name);
        addedCurrencies.push(split[0]);
      }
    }

    if (element.name.includes("-") && element.name.includes("PERP")) {
      const split = element.name.split("-");
      if (!addedCurrencies.includes(split[0])) {
        markets.push({
          name: element.name,
          lastTriggered: defaultDate,
        });
        addedCurrencies.push(split[0]);
      }
    }
  }

  return markets;
};

export const GetCandles = async (
  market: string,
  resolution: number = 900,
  num_candles: number = 20
) => {
  const candles = await axios.get(endpoints.GET_CANDLES(market, resolution));
  const last_x_candles = candles.data.result
    .slice(candles.data.result.length - num_candles)
    .map((candle: any) => {
      const mappedCandle: Candle = {
        close: candle.close,
        open: candle.open,
        typicalPrice: (candle.close + candle.high + candle.low) / 3,
        low: candle.low,
        high: candle.high,
      };

      return mappedCandle;
    });

  return last_x_candles;
};
