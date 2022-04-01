"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require("./utilities");
const marketsService = require("./../market/marketService");
const CalculateBolingerBands = (currency, resolution, stdDev = 3) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const candles = yield marketsService.GetCandles(currency.name, resolution);
    const typical_price = candles.map((el) => el.typicalPrice);
    const currentPrice = candles[candles.length - 1].close;

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
    const BolingerBand = {
      currentPrice: currentPrice,
      lowerBollingerBand: lower3BollingerBand,
      upperBollingerBand: upper3BollingerBand,
      currentCrossingBollingerLevel,
    };
    return BolingerBand;
  });
module.exports = {
  CalculateBolingerBands,
};
//# sourceMappingURL=bolingerbands.js.map
