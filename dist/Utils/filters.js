"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyFilter = void 0;
const blacklist = ["USD, USDT, BULL, BEAR, SHIT"];
const volumeThreshold = 3600000;
const currencyFilter = (currency, volume) => {
    if (!currency.marketName.includes("-") && !currency.marketName.includes("/"))
        return false;
    if (!currency.marketName.includes("PERP") && !currency.marketName.includes("USDT"))
        return false;
    const delimiter = currency.marketName.includes("-") ? "-" : "/";
    const name = currency.marketName.split(delimiter)[0];
    if (blacklist.includes(name))
        return false;
    if (volume < volumeThreshold)
        return false;
    return true;
};
exports.currencyFilter = currencyFilter;
//# sourceMappingURL=filters.js.map