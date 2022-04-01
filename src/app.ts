require("dotenv").config();
const marketsService = require("./market/marketService");

const app = async () => {
  const markets = await marketsService.GetMarkets();
  console.log(markets);
};

app();
