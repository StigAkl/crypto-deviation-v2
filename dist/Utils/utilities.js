"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldPerformAnalysis = exports.crossedBollingerBand = exports.LowerbollingerBand = exports.UpperbollingerBand = exports.std = exports.movingAverage = exports.delay = void 0;
const types_1 = require("../types");
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
const shouldPerformAnalysis = (currency, timeframe) => {
    switch (timeframe) {
        case types_1.Timeframe.EveryFifteenMinute:
            return currency.lastTriggered15.getTime() + parseInt(suppressionTime) < Date.now();
        case types_1.Timeframe.Hourly:
            return currency.lastTriggeredH.getTime() + parseInt(suppressionTime) < Date.now();
        case types_1.Timeframe.EveryFourthHour:
            return currency.lastTriggered4H.getTime() + parseInt(suppressionTime) < Date.now();
    }
};
exports.shouldPerformAnalysis = shouldPerformAnalysis;
//# sourceMappingURL=utilities.js.map