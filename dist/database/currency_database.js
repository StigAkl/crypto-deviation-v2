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
            const currency = {
                name: c.name,
                lastTriggeredH: new Date(c.lastTriggeredH),
                lastTriggered15: new Date(c.lastTriggered15),
                lastTriggered4H: new Date(c.lastTriggered4H),
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
            switch (timeframe) {
                case types_1.Timeframe.EveryFifteenMinute:
                    item.lastTriggered15 = new Date();
                    break;
                case types_1.Timeframe.Hourly:
                    item.lastTriggeredH = new Date();
                    break;
                case types_1.Timeframe.EveryFourthHour:
                    item.lastTriggered4H = new Date();
                    break;
            }
        }
    });
    yield (0, exports.LoadCurrenciesToJson)(markets, true);
});
exports.SetSuppression = SetSuppression;
const ResetSuppression = () => {
    const markets = (0, exports.GetMarkets)();
    const defaultDate = new Date(2020, 1, 1);
    markets.forEach((item) => {
        item.lastTriggered15 = defaultDate;
        item.lastTriggeredH = defaultDate;
        item.lastTriggered4H = defaultDate;
    });
    (0, exports.LoadCurrenciesToJson)(markets, true);
};
exports.ResetSuppression = ResetSuppression;
//# sourceMappingURL=currency_database.js.map