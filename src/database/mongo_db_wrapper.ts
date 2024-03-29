import { Currency } from "../types";

const Params = require("./entities/params");
const CurrencyEntity = require("./entities/currency");

export const GetCurrencies = async () => {
  const currencies = await CurrencyEntity.find({});

  const mappedCurrencies: Currency[] = currencies.map((c) => {
    const mappedCurrency: Currency = {
      lastTriggered: c.lastTriggeredBand,
      marketName: c.marketName,
      name: c.name,
    };

    return mappedCurrency;
  });

  return mappedCurrencies;
};

export const SetSuppression = async (name: string, timeframe: number) => {
  console.log("Suppressing", name);
  const currency = await CurrencyEntity.findOne({
    name: name,
  }).exec();

  const map = currency.lastTriggeredBand;
  map.set(timeframe.toString(), new Date());

  currency.lastTriggeredBand = map;

  await currency.save();
};

export const IsActive = async () => {
  const params = (await Params.find({}))[0];

  if (!params) return false;

  return params.isActive;
};
