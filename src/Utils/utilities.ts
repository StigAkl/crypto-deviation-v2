import { Currency, Timeframe } from "../types";
const fs = require("fs");

const suppressionTime = process.env.SUPPRESSION_TIME;

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const movingAverage = (data: any) =>
  data.reduce((a, b) => a + b, 0) / data.length;

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

export const getChannel = (timeframe: Timeframe, client: any) => {
  switch (timeframe) {
    case Timeframe.EveryFifteenMinute:
      return client.channels.cache.find((channel) =>
        channel.name.includes("15m")
      );
    case Timeframe.Hourly:
      return client.channels.cache.find((channel) =>
        channel.name.includes("1h")
      );
    case Timeframe.EveryFourthHour:
      return client.channels.cache.find((channel) =>
        channel.name.includes("4h")
      );
  }
};

export const SendAlert = (
  currency: Currency,
  channel: any,
  long: boolean,
  price: number,
  bbScore: number
) => {
  const title = long
    ? `${currency.name} crossed lower bolinger band`
    : `${currency.name} crossed upper bolinger band`;
  const tradingView =
    "https://www.tradingview.com/chart/?symbol=:symbol:".replace(
      ":symbol:",
      currency.name.concat("USDT")
    );
  const color = long ? 3066993 : 10038562;

  if (process.env.NODE_ENV === "development") {
    console.log(title);
    return;
  }

  channel.send({
    embeds: [
      {
        title,
        color,
        fields: [
          {
            name: "Price",
            value: price.toString(),
            inline: true,
          },
          {
            name: "Bolinger band score",
            value: bbScore.toFixed(2),
            inline: true,
          },
          {
            name: "Trading view",
            value: tradingView,
            inline: false,
          },
        ],
      },
    ],
  });
};

export const shouldPerformAnalysis = (
  currency: Currency,
  timeframe: Timeframe
) => {
  const strTimeFrame = timeframe.toString();

  if (!currency.lastTriggered.get(strTimeFrame)) {
    return true;
  }

  return (
    currency.lastTriggered.get(strTimeFrame).getTime() +
      parseInt(suppressionTime) <
    Date.now()
  );
};
