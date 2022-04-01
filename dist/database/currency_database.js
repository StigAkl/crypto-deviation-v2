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
const fs = require("fs");
const database = "./src/database/perpetual_futures.json";
const defaultDate = new Date(2000, 1, 1);
const LoadCurrenciesToJson = (markets, override = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync(database) || override) {
        const mappedMarkets = markets.map((m) => {
            const currency = {
                name: m.name,
                lastTriggered: defaultDate,
            };
            return currency;
        });
        fs.writeFile(database, JSON.stringify(mappedMarkets), "utf8", (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("File saved");
            }
        });
    }
});
const GetMarkets = () => {
    if (fs.existsSync(database)) {
        const markets = JSON.parse(fs.readFileSync(database));
        return markets;
    }
    else {
        console.error("Database file not found");
        throw Error;
    }
};
const SetSuppression = (currency) => __awaiter(void 0, void 0, void 0, function* () {
    const markets = GetMarkets();
    markets.forEach((item) => {
        if (item.name === currency.name) {
            item.lastTriggered = new Date();
        }
    });
    yield LoadCurrenciesToJson(markets, true);
});
module.exports = {
    LoadCurrenciesToJson,
    GetMarkets,
    SetSuppression,
};
//# sourceMappingURL=currency_database.js.map