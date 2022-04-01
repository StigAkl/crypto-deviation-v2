import { Currency } from "./types";
require("dotenv").config();
const Utils = require("./Utils/utilities");
const Database = require("./database/currency_database");
const BolingerBands = require("./Utils/bolingerbands");
const TimeFrames = require("./constants/timeframes");

const performAnalysis = async (timeFrame: number, stdDev: number = 3) => {
  const markets = Database.GetMarkets();

  console.log(
    `Performing analysis with std dev ${stdDev} and timeframe ${timeFrame}`
  );

  for (let i = 0; i < markets.length; i++) {
    const currency = markets[i];

    if (!Utils.shouldPerformAnalysis(currency)) {
      continue;
    }

    const {
      upperBollingerBand,
      lowerBollingerBand,
      currentPrice,
      currentCrossingBollingerLevel,
    } = await BolingerBands.CalculateBolingerBands(currency, timeFrame, stdDev);

    console.log("\n\n-----------------");
    console.log("Valuta: ", currency.name);
    console.log("Lower bolinger band:", upperBollingerBand);
    console.log("Upper bolinger band:", lowerBollingerBand);
    console.log("Price:", currentPrice);
    console.log("-----------------\n\n");

    let alertTriggered = false;
    if (currentPrice >= upperBollingerBand) {
      alertTriggered = true;
      console.log(
        `Upper bollinger band hit for ${currency.name}. Price: ${currentPrice}, BB: ${currentCrossingBollingerLevel}`
      );
    }

    if (currentPrice <= lowerBollingerBand) {
      alertTriggered = true;
      console.log(
        `Lower bollinger band hit for ${
          currency.name
        }. Price: ${currentPrice}, BB: ${Math.abs(
          currentCrossingBollingerLevel
        )}`
      );
    }

    if (alertTriggered) {
      Database.SetSuppression(currency);
    }

    await Utils.delay(300);
  }
};

const app = async () => {
  //TODO: Nightly / daily dump of crypto quote volume data from markets service to local database
  //const markets = await marketsService.GetMarkets();
  //await Database.LoadCurrenciesToJson(markets, true);
  //const candles = await marketsService.GetCandles("btc/usdt", 900);

  const markets = Database.GetMarkets();

  await performAnalysis(TimeFrames.fifteen, 1.5);
};

app();
