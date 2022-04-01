import { BolingerBands, Currency } from "../types";
const Utils = require("./utilities");
const marketsService = require("./../market/marketService");

const CalculateBolingerBands = async (
  currency: Currency,
  resolution: number,
  stdDev: number = 3
) => {
  const candles = await marketsService.GetCandles(currency.name, resolution);

  const typical_price = candles.map((el) => el.typicalPrice);
  const currentPrice = candles[candles.length - 1].close;

  console.log("std:", stdDev);
  console.log("resolution:", resolution);
  console.log("Currency:", currency.name);

  //Calculate simple moving average, standard deviation and upper/lower bollinger bands
  const sma = Utils.movingAverage(typical_price);
  const std = Utils.std(typical_price);
  const upper3BollingerBand = Utils.UpperbollingerBand(sma, stdDev, std);
  const lower3BollingerBand = Utils.LowerbollingerBand(sma, stdDev, std);

  //Calculate current bollinger band level
  const currentCrossingBollingerLevel = Utils.crossedBollingerBand(
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

module.exports = {
  CalculateBolingerBands,
};
