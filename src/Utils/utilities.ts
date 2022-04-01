import { Currency, Timeframe } from "../types";

const suppressionTime = process.env.SUPPRESSION_TIME;

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const movingAverage = (data: any) => data.reduce((a, b) => a + b, 0) / data.length;

export const std = (data: any) => {
  const sma = movingAverage(data);
  let sum = 0;
  data.forEach((element) => {
    sum += (element - sma) * (element - sma);
  });
  const population_standard_deviation = Math.sqrt(sum / data.length);
  return population_standard_deviation;
};

export const UpperbollingerBand = (ma, m, std) => {
  return ma + m * std;
};

export const LowerbollingerBand = (ma, m, std) => {
  return ma - m * std;
};

export const crossedBollingerBand = (currentPrice, std, ma) => {
  return (currentPrice - ma) / std;
};

export const shouldPerformAnalysis = (currency: Currency, timeframe: Timeframe) => {
  switch(timeframe) {
    case Timeframe.EveryFifteenMinute:
      return currency.lastTriggered15.getTime() + parseInt(suppressionTime) < Date.now();
    case Timeframe.Hourly:
      return currency.lastTriggeredH.getTime() + parseInt(suppressionTime) < Date.now();
    case Timeframe.EveryFourthHour:
      return currency.lastTriggered4H.getTime() + parseInt(suppressionTime) < Date.now();
  }
};