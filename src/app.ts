require("dotenv").config();
import { shouldPerformAnalysis, delay } from './Utils/utilities';
import { GetMarkets, SetSuppression } from './database/currency_database';
import { Timeframe } from './types';
import { CalculateBolingerBands } from './Utils/bolingerbands';


const performAnalysis = async (timeFrame: Timeframe, stdDev: number = 3) => {
  const markets = GetMarkets();

  console.log(
    `Performing analysis with std dev ${stdDev} and timeframe ${timeFrame}`
  );

  for (let i = 0; i < markets.length; i++) {
    const currency = markets[i];

    if (!shouldPerformAnalysis(currency, timeFrame)) {
      continue;
    }

    const {
      upperBollingerBand,
      lowerBollingerBand,
      currentPrice,
      currentCrossingBollingerLevel,
    } = await CalculateBolingerBands(currency, timeFrame, stdDev);

    console.log("Currency:", currency.name)
    console.log("upper:", upperBollingerBand)
    console.log("lower:", lowerBollingerBand)
    console.log("Price:", currentPrice);

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
      SetSuppression(currency, Timeframe.EveryFifteenMinute);
    }
    await delay(300);
  }
};

const app = async () => {
  await performAnalysis(Timeframe.EveryFifteenMinute, 1);
  //const markets = await GetMarketsService(); 
  //LoadCurrenciesToJson(markets, true);
};

app();
