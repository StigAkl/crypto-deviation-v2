"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldPerformAnalysis = exports.SendAlert = exports.getChannel = exports.crossedBollingerBand = exports.LowerbollingerBand = exports.UpperbollingerBand = exports.std = exports.movingAverage = exports.delay = void 0;
const types_1 = require("../types");
const fs = require("fs");
const suppressionTime = process.env.SUPPRESSION_TIME;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.delay = delay;
const movingAverage = (data) => data.reduce((a, b) => a + b, 0) / data.length;
exports.movingAverage = movingAverage;
const std = (data) => {
    const sma = (0, exports.movingAverage)(data);
    let sum = 0;
    data.forEach((element) => {
        sum += (element - sma) * (element - sma);
    });
    const population_standard_deviation = Math.sqrt(sum / data.length);
    return population_standard_deviation;
};
exports.std = std;
const UpperbollingerBand = (ma, m, std) => {
    return ma + m * std;
};
exports.UpperbollingerBand = UpperbollingerBand;
const LowerbollingerBand = (ma, m, std) => {
    return ma - m * std;
};
exports.LowerbollingerBand = LowerbollingerBand;
const crossedBollingerBand = (currentPrice, std, ma) => {
    return (currentPrice - ma) / std;
};
exports.crossedBollingerBand = crossedBollingerBand;
const getChannel = (timeframe, client) => {
    switch (timeframe) {
        case types_1.Timeframe.EveryFifteenMinute:
            return client.channels.cache.find((channel) => channel.name.includes("15m"));
        case types_1.Timeframe.Hourly:
            return client.channels.cache.find((channel) => channel.name.includes("1h"));
        case types_1.Timeframe.EveryFourthHour:
            return client.channels.cache.find((channel) => channel.name.includes("4h"));
    }
};
exports.getChannel = getChannel;
const SendAlert = (currency, channel, long, price, bbScore) => {
    const title = long
        ? `${currency.name} crossed lower bolinger band`
        : `${currency.name} crossed upper bolinger band`;
    const tradingView = "https://www.tradingview.com/chart/?symbol=:symbol:".replace(":symbol:", currency.name.concat("USDT"));
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
exports.SendAlert = SendAlert;
const shouldPerformAnalysis = (currency, timeframe) => {
    const strTimeFrame = timeframe.toString();
    if (!currency.lastTriggered.get(strTimeFrame)) {
        return true;
    }
    return (currency.lastTriggered.get(strTimeFrame).getTime() +
        parseInt(suppressionTime) <
        Date.now());
};
exports.shouldPerformAnalysis = shouldPerformAnalysis;
//# sourceMappingURL=utilities.js.map