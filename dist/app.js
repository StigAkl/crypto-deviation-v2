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
const utilities_1 = require("./Utils/utilities");
const mongo_db_wrapper_1 = require("./database/mongo_db_wrapper");
const types_1 = require("./types");
const bolingerbands_1 = require("./Utils/bolingerbands");
require("./database/mongoose");
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const performAnalysis = (timeFrame, stdDev = 3) => __awaiter(void 0, void 0, void 0, function* () {
    const discordChannel = (0, utilities_1.getChannel)(timeFrame, client);
    const markets = yield (0, mongo_db_wrapper_1.GetCurrencies)();
    console.log(`Performing analysis with std dev ${stdDev} and timeframe ${timeFrame}`);
    for (let i = 0; i < markets.length; i++) {
        const currency = markets[i];
        if (!(0, utilities_1.shouldPerformAnalysis)(currency, timeFrame)) {
            continue;
        }
        const { upperBollingerBand, lowerBollingerBand, currentPrice, currentCrossingBollingerLevel, } = yield (0, bolingerbands_1.CalculateBolingerBands)(currency, timeFrame, stdDev);
        let alertTriggered = false;
        if (currentPrice >= upperBollingerBand) {
            alertTriggered = true;
            (0, utilities_1.SendAlert)(currency, discordChannel, false, currentPrice, currentCrossingBollingerLevel);
        }
        if (currentPrice <= lowerBollingerBand) {
            alertTriggered = true;
            (0, utilities_1.SendAlert)(currency, discordChannel, true, currentPrice, currentCrossingBollingerLevel);
        }
        if (alertTriggered) {
            (0, mongo_db_wrapper_1.SetSuppression)(currency.name, timeFrame);
        }
        yield (0, utilities_1.delay)(50);
    }
});
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
        yield performAnalysis(types_1.Timeframe.EveryFifteenMinute, 0.5);
        yield performAnalysis(types_1.Timeframe.Hourly, 0.5);
        yield performAnalysis(types_1.Timeframe.EveryFourthHour, 0.5);
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            yield performAnalysis(types_1.Timeframe.EveryFifteenMinute, 3);
            yield performAnalysis(types_1.Timeframe.Hourly, 3);
            yield performAnalysis(types_1.Timeframe.EveryFourthHour, 3);
        }), 5 * 60 * 1000);
    }
    catch (error) {
        console.error(error);
    }
}));
client.login(process.env.DISCORD_BOT_TOKEN);
//# sourceMappingURL=app.js.map