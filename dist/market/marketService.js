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
exports.GetCandles = exports.ListAllMarkets = exports.GetMarkets = void 0;
const filters_1 = require("../Utils/filters");
const endpoints = require("../constants/endpoints");
const axios = require("axios");
const GetMarkets = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, exports.ListAllMarkets)();
    const filteredMarkets = (0, filters_1.removeDuplicates)(response.filter(filters_1.currencyFilter).map(filters_1.currencyMapper));
    return filteredMarkets;
});
exports.GetMarkets = GetMarkets;
const ListAllMarkets = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield axios.get(endpoints.GET_MARKETS());
    return result.data.result;
});
exports.ListAllMarkets = ListAllMarkets;
const GetCandles = (market, timeframe = 900, num_candles = 20) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(endpoints.GET_CANDLES(market, timeframe));
    const candles = yield axios.get(endpoints.GET_CANDLES(market, timeframe));
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