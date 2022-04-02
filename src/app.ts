require("dotenv").config();
import { shouldPerformAnalysis, delay, getChannel, SendAlert } from './Utils/utilities';
import { GetMarkets, SetSuppression } from './database/currency_database';
import { Timeframe } from './types';
import { CalculateBolingerBands } from './Utils/bolingerbands';
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const performAnalysis = async (timeFrame: Timeframe, stdDev: number = 3) => {
  const discordChannel = getChannel(timeFrame, client); 
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

    let alertTriggered = false;
    if (currentPrice >= upperBollingerBand) {
      alertTriggered = true;
      SendAlert(currency, discordChannel, false, currentPrice, currentCrossingBollingerLevel); 
    }

    if (currentPrice <= lowerBollingerBand) {
      console.log(lowerBollingerBand, currentPrice);
      alertTriggered = true;
      SendAlert(currency, discordChannel, true, currentPrice, currentCrossingBollingerLevel); 
    }

    if (alertTriggered) {
      SetSuppression(currency, timeFrame);
    }
    await delay(100);
  }
};

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  try {
    await performAnalysis(Timeframe.EveryFifteenMinute, 3);
    await performAnalysis(Timeframe.Hourly, 3);
    await performAnalysis(Timeframe.EveryFourthHour, 3); 

    setInterval(async ()=> {
      await performAnalysis(Timeframe.EveryFifteenMinute, 3);
      await performAnalysis(Timeframe.Hourly, 3);
      await performAnalysis(Timeframe.EveryFourthHour, 3); 
    }, 5*60*1000);
  } catch(error) {
    console.log(error); 
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
