import { Currency } from "../types";
const fs = require("fs");
const database = "./src/database/perpetual_futures.json";
const defaultDate = new Date(2000, 1, 1);

const LoadCurrenciesToJson = async (
  markets: Currency[],
  override: boolean = false
) => {
  if (!fs.existsSync(database) || override) {
    const mappedMarkets = markets.map((m: Currency) => {
      const currency: Currency = {
        name: m.name,
        lastTriggered: m.lastTriggered,
      };
      return currency;
    });
    fs.writeFile(database, JSON.stringify(mappedMarkets), "utf8", (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File saved");
      }
    });
  }
};

const GetMarkets = (): Currency[] => {
  if (fs.existsSync(database)) {
    const markets: Currency[] = JSON.parse(fs.readFileSync(database));
    const mappedMarkets = markets.map((c) => {
      const currency: Currency = {
        name: c.name,
        lastTriggered: new Date(c.lastTriggered),
      };
      return currency;
    });
    return mappedMarkets;
  } else {
    console.error("Database file not found");
    throw Error;
  }
};

const SetSuppression = async (currency: Currency) => {
  const markets = GetMarkets();
  markets.forEach((item: Currency) => {
    if (item.name === currency.name) {
      item.lastTriggered = new Date();
    }
  });

  const filtered = markets.filter((x) => x.name === currency.name);
  console.log("FILTERED:", filtered);
  await LoadCurrenciesToJson(markets, true);
};

module.exports = {
  LoadCurrenciesToJson,
  GetMarkets,
  SetSuppression,
};
