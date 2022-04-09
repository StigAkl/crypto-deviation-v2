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
    
      Object.keys(c.lastTriggered).forEach(lastTriggered => {
        c.lastTriggered[Timeframe.EveryFifteenMinute] = new Date(lastTriggered)
        c.lastTriggered[Timeframe.Hourly] = new Date(lastTriggered)
        c.lastTriggered[Timeframe.EveryFourthHour] = new Date(lastTriggered)
      })

      const currency: Currency = {
        name: c.name,
        lastTriggered: new Map<number, Date>(),
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
      item.lastTriggered[timeframe] = new Date();
    }
  });

  await LoadCurrenciesToJson(markets, true);
}

export const ResetSuppression = () => {
  const markets = GetMarkets(); 

  console.log(markets[0])
  const map = new Map<number, Date>(); 
  map.set(Timeframe.EveryFifteenMinute, new Date()); 
  map.set(Timeframe.Hourly, new Date()); 
  map.set(Timeframe.EveryFourthHour, new Date()); 

  markets.forEach((item) => {
    console.log("=!=!=!=!!=")
    item.lastTriggered = map; 
    console.log(item); 
    console.log(map); 
  })

  LoadCurrenciesToJson(markets, true); 
};
