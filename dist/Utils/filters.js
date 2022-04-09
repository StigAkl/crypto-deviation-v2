"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicates = exports.currencyMapper = exports.currencyFilter = void 0;
const blacklist = ["USD", "USDT", "BULL", "BEAR", "SHIT"];
const volumeThreshold = 10000000;
const defaultDate = new Date(2000, 1, 1);
;
const currencyFilter = (currency) => {
    if (!currency.name.includes("-") && !currency.name.includes("/"))
        return false;
    if (!currency.name.includes("PERP") && !currency.name.includes("USDT"))
        return false;
    const delimiter = currency.name.includes("-") ? "-" : "/";
    const name = currency.name.split(delimiter)[0];
    if (blacklist.includes(name))
        return false;
    if (currency.volumeUsd24h < volumeThreshold)
        return false;
    return true;
};
exports.currencyFilter = currencyFilter;
const currencyMapper = (currency) => {
    const name = currency.name.includes("-") ? currency.name.split("-")[0] : currency.name.split("/")[0];
    const mappedCurrency = {
        name,
        marketName: currency.name,
        lastTriggered: new Map()
    };
    return mappedCurrency;
};
exports.currencyMapper = currencyMapper;
const removeDuplicates = (currencies) => {
    const addedFlags = [];
    const filteredCurrencies = [];
    for (let i = 0; i < currencies.length; i++) {
        const currency = currencies[i];
        if (!addedFlags.includes(currency.name)) {
            addedFlags.push(currency.name);
            filteredCurrencies.push(currency);
        }
    }
    return filteredCurrencies;
};
exports.removeDuplicates = removeDuplicates;
//# sourceMappingURL=filters.js.map