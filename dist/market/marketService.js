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
exports.GetCandles = exports.GetMarkets = void 0;
const defaultDate = new Date(2000, 1, 1);
const endpoints = require("../constants/endpoints");
const axios = require("axios");
const GetMarkets = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield axios.get(endpoints.GET_MARKETS());
    const addedCurrencies = [];
    const filteredResults = result.data.result.filter((market) => market.quoteVolume24h > 1800000);
    const markets = [];
    for (let i = 0; i < filteredResults.length; i++) {
        const element = filteredResults[i];
        if (element.name.includes("/") &&
            (element.name.includes("USD") || element.name.includes("USDT"))) {
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
});
exports.GetMarkets = GetMarkets;
const GetCandles = (market, resolution = 900, num_candles = 20) => __awaiter(void 0, void 0, void 0, function* () {
    const candles = yield axios.get(endpoints.GET_CANDLES(market, resolution));
    const last_x_candles = candles.data.result
        .slice(candles.data.result.length - num_candles)
        .map((candle) => {
        const mappedCandle = {
            close: candle.close,
            open: candle.open,
            typicalPrice: (candle.close + candle.high + candle.low) / 3,
            low: candle.low,
            high: candle.high,
        };
        return mappedCandle;
    });
    return last_x_candles;
});
exports.GetCandles = GetCandles;
//# sourceMappingURL=marketService.js.map