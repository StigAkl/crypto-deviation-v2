import { BolingerBands, Currency, Timeframe } from "../types";
const marketsService = require("./../market/marketService");
import { movingAverage, UpperbollingerBand, 
  LowerbollingerBand, crossedBollingerBand, std as standardDeviation } from "./utilities";

export const CalculateBolingerBands = async (
  currency: Currency,
  timeframe: Timeframe,
  stdDev: number = 3
) => {
  const candles = await marketsService.GetCandles(currency.marketName, timeframe);

  const typical_price = candles.map((el) => el.typicalPrice);
  const currentPrice = candles[candles.length - 1].close;

  //Calculate simple moving average, standard deviation and upper/lower bollinger bands
  const sma = movingAverage(typical_price);
  const std = standardDeviation(typical_price);
  const upper3BollingerBand = UpperbollingerBand(sma, stdDev, std);
  const lower3BollingerBand = LowerbollingerBand(sma, stdDev, std);

  //Calculate current bollinger band level
  const currentCrossingBollingerLevel = crossedBollingerBand(
    currentPrice,
    std,
    sma
  );

  const BolingerBand: BolingerBands = {
    currentPrice: currentPrice,
    lowerBollingerBand: lower3BollingerBand,
    upperBollingerBand: upper3BollingerBand,
    currentCrossingBollingerLevel,
  };

  return BolingerBand;
};