"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateBolingerBands = void 0;
const marketService_1 = require("./../market/marketService");
const utilities_1 = require("./utilities");
const CalculateBolingerBands = (currency, timeframe, stdDev = 3) => __awaiter(void 0, void 0, void 0, function* () {
    const candles = yield (0, marketService_1.GetCandles)(currency.marketName, timeframe);
    const typical_price = candles.map((el) => el.typicalPrice);
    const currentPrice = candles[candles.length - 1].close;
    //Calculate simple moving average, standard deviation and upper/lower bollinger bands
    const sma = (0, utilities_1.movingAverage)(typical_price);
    const std = (0, utilities_1.std)(typical_price);
    const upper3BollingerBand = (0, utilities_1.UpperbollingerBand)(sma, stdDev, std);
    const lower3BollingerBand = (0, utilities_1.LowerbollingerBand)(sma, stdDev, std);
    //Calculate current bollinger band level
    const currentCrossingBollingerLevel = (0, utilities_1.crossedBollingerBand)(currentPrice, std, sma);
    const BolingerBand = {
        currentPrice: currentPrice,
        lowerBollingerBand: lower3BollingerBand,
        upperBollingerBand: upper3BollingerBand,
        currentCrossingBollingerLevel,
    };
    return BolingerBand;
});
exports.CalculateBolingerBands = CalculateBolingerBands;
//# sourceMappingURL=bolingerbands.js.map