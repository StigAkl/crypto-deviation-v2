import { Currency, Timeframe } from "../types";
const fs = require("fs");
const database = "./src/database/perpetual_futures.json";

export const LoadCurrenciesToJson = async (
  markets: Currency[],
  override: boolean = false
) => {
  if (!fs.existsSync(database) || override) {
    fs.writeFile(
      database,
      JSON.stringify(markets, undefined, 2),
      "utf8",
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("File saved");
        }
      }
    );
  }
};

export const GetMarkets = (): Currency[] => {
  if (fs.existsSync(database)) {
    const markets: Currency[] = JSON.parse(fs.readFileSync(database));
    const mappedMarkets = markets.map((c) => {
      const currency: Currency = {
        name: c.name,
        lastTriggeredH: new Date(c.lastTriggeredH),
        lastTriggered15: new Date(c.lastTriggered15),
        lastTriggered4H: new Date(c.lastTriggered4H),
        marketName: c.marketName
      };

      return currency;
    });
    return mappedMarkets;
  } else {
    console.error("Database file not found");
    throw Error;
  }
};

export const SetSuppression = async (currency: Currency, timeframe: Timeframe) => {
  const markets = GetMarkets();
  markets.forEach((item: Currency) => {
    if (item.name === currency.name) {
      switch(timeframe) {
        case Timeframe.EveryFifteenMinute:
          item.lastTriggered15 = new Date(); 
          break; 
        case Timeframe.Hourly: 
          item.lastTriggeredH = new Date();
          break; 
        case Timeframe.EveryFourthHour:
          item.lastTriggered4H = new Date();
          break; 
      }
    }
  });

  await LoadCurrenciesToJson(markets, true);
}

export const ResetSuppression = () => {
  const markets = GetMarkets(); 
  const defaultDate = new Date(2020, 1, 1);
  markets.forEach((item) => {
    item.lastTriggered15 = defaultDate; 
    item.lastTriggeredH = defaultDate; 
    item.lastTriggered4H = defaultDate;
  })

  LoadCurrenciesToJson(markets, true); 
};
