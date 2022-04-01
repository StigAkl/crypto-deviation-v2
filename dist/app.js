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
require("dotenv").config();
const Utils = require("./Utils/utilities");
const Database = require("./database/currency_database");
const BolingerBands = require("./Utils/bolingerbands");
const TimeFrames = require("./constants/timeframes");
const performAnalysis = (markets, timeFrame, stdDev = 3) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < markets.length; i++) {
        const currency = markets[i];
        const { upperBollingerBand, lowerBollingerBand, currentPrice, currentCrossingBollingerLevel, } = yield BolingerBands.CalculateBolingerBands(currency, timeFrame, stdDev);
        console.log("\n\n-----------------");
        console.log("Valuta: ", currency.name);
        console.log("Lower bolinger band:", upperBollingerBand);
        console.log("Upper bolinger band:", lowerBollingerBand);
        console.log("Price:", currentPrice);
        console.log("-----------------\n\n");
        let alertTriggered = false;
        if (currentPrice >= upperBollingerBand) {
            alertTriggered = true;
            console.log(`Upper bollinger band hit for ${currency.name}. Price: ${currentPrice}, BB: ${currentCrossingBollingerLevel}`);
        }
        if (currentPrice <= lowerBollingerBand) {
            alertTriggered = true;
            console.log(`Lower bollinger band hit for ${currency.name}. Price: ${currentPrice}, BB: ${Math.abs(currentCrossingBollingerLevel)}`);
        }
        if (alertTriggered) {
            //Todo: Suppression
        }
        yield Utils.delay(300);
    }
});
const app = () => __awaiter(void 0, void 0, void 0, function* () {
    //TODO: Nightly / daily dump of crypto quote volume data from markets service to local database
    //const markets = await marketsService.GetMarkets();
    //await Database.LoadCurrenciesToJson(markets, true);
    //const candles = await marketsService.GetCandles("btc/usdt", 900);
    const markets = Database.GetMarkets();
    yield performAnalysis(markets, TimeFrames.fifteen);
});
app();
//# sourceMappingURL=app.js.map