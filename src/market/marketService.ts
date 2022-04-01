const endpoints = require("../constants/endpoints");
const axios = require("axios");

export const GetMarkets = async (): Promise<string[]> => {
  const result = await axios.get(endpoints.GET_MARKETS());

  const filteredResults = result.data.result.filter(
    (market) => market.quoteVolume24h > 1800000
  );

  const markets: string[] = [];

  for (let i = 0; i < filteredResults.length; i++) {
    const element = filteredResults[i];
    if (
      element.name.includes("/") &&
      (element.name.includes("USD") || element.name.includes("USDT"))
    ) {
      const split = element.name.split("/");
      markets.push(split[0]);
    }

    if (element.name.includes("-") && element.name.includes("PERP")) {
      const split = element.name.split("-");
      markets.push(split[0]);
    }
  }

  return [...new Set(markets)];
};
