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
exports.ResetSuppression = exports.SetSuppression = exports.GetMarkets = exports.LoadCurrenciesToJson = void 0;
const types_1 = require("../types");
const fs = require("fs");
const database = "./src/database/perpetual_futures.json";
const LoadCurrenciesToJson = (markets, override = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync(database) || override) {
        fs.writeFile(database, JSON.stringify(markets, undefined, 2), "utf8", (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("File saved");
            }
        });
    }
});
exports.LoadCurrenciesToJson = LoadCurrenciesToJson;
const GetMarkets = () => {
    if (fs.existsSync(database)) {
        const markets = JSON.parse(fs.readFileSync(database));
        const mappedMarkets = markets.map((c) => {
            Object.keys(c.lastTriggered).forEach(lastTriggered => {
                c.lastTriggered[types_1.Timeframe.EveryFifteenMinute] = new Date(lastTriggered);
                c.lastTriggered[types_1.Timeframe.Hourly] = new Date(lastTriggered);
                c.lastTriggered[types_1.Timeframe.EveryFourthHour] = new Date(lastTriggered);
            });
            const currency = {
                name: c.name,
                lastTriggered: new Map(),
                marketName: c.marketName
            };
            return currency;
        });
        return mappedMarkets;
    }
    else {
        console.error("Database file not found");
        throw Error;
    }
};
exports.GetMarkets = GetMarkets;
const SetSuppression = (currency, timeframe) => __awaiter(void 0, void 0, void 0, function* () {
    const markets = (0, exports.GetMarkets)();
    markets.forEach((item) => {
        if (item.name === currency.name) {
            item.lastTriggered[timeframe] = new Date();
        }
    });
    yield (0, exports.LoadCurrenciesToJson)(markets, true);
});
exports.SetSuppression = SetSuppression;
const ResetSuppression = () => {
    const markets = (0, exports.GetMarkets)();
    console.log(markets[0]);
    const map = new Map();
    map.set(types_1.Timeframe.EveryFifteenMinute, new Date());
    map.set(types_1.Timeframe.Hourly, new Date());
    map.set(types_1.Timeframe.EveryFourthHour, new Date());
    markets.forEach((item) => {
        console.log("=!=!=!=!!=");
        item.lastTriggered = map;
        console.log(item);
        console.log(map);
    });
    (0, exports.LoadCurrenciesToJson)(markets, true);
};
exports.ResetSuppression = ResetSuppression;
//# sourceMappingURL=currency_database_deprecated.js.map