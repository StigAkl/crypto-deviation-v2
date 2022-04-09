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
exports.SetSuppression = exports.GetCurrencies = void 0;
const CurrencyEntity = require("./entities/currency");
const GetCurrencies = () => __awaiter(void 0, void 0, void 0, function* () {
    const currencies = yield CurrencyEntity.find({});
    const mappedCurrencies = currencies.map(c => {
        const map = c.lastTriggered ? c.lastTriggered : new Map();
        const mappedCurrency = {
            lastTriggered: map,
            marketName: c.marketName,
            name: c.name
        };
        return mappedCurrency;
    });
    return mappedCurrencies;
});
exports.GetCurrencies = GetCurrencies;
const SetSuppression = (name, timeframe) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Suppressing", name);
    const currency = yield CurrencyEntity.findOne({
        "name": name
    }).exec();
    const map = currency.lastTriggeredBand;
    map.set(timeframe, new Date());
    currency.lastTriggeredBand = map;
    yield currency.save();
});
exports.SetSuppression = SetSuppression;
//# sourceMappingURL=mongo_db_wrapper.js.map