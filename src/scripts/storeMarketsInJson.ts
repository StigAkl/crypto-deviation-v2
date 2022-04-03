import { LoadCurrenciesToJson } from "../database/currency_database";
import { GetMarkets } from "../market/marketService";
require("dotenv").config();

const loadMarketsToJson = async () => {
    console.log("running");
    const markets = await GetMarkets();

    LoadCurrenciesToJson(markets, true); 
}

loadMarketsToJson(); 
