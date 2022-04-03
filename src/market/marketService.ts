import { Candle, Currency, Timeframe } from "../types";
import { currencyFilter, currencyMapper, removeDuplicates } from "../Utils/filters";
const endpoints = require("../constants/endpoints");
const axios = require("axios");

export const GetMarkets = async (): Promise<Currency[]> => {
  const response = await ListAllMarkets();
  const filteredMarkets = removeDuplicates(response.filter(currencyFilter).map(currencyMapper));
  return filteredMarkets;
};

export const ListAllMarkets = async () => {
  const result = await axios.get(endpoints.GET_MARKETS());
  return result.data.result;
}

export const GetCandles = async (
  market: string,
  timeframe: Timeframe = 900,
  num_candles: number = 20
) => {
  console.log(endpoints.GET_CANDLES(market, timeframe));
  const candles = await axios.get(endpoints.GET_CANDLES(market, timeframe));
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
