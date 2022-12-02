import { GetCurrencies } from '../database/mongo_db_wrapper';
require("dotenv").config();
require("../database/mongoose"); 
const init = async () => {
  const currencies = await GetCurrencies();

}

console.log("Initialising");
init(); 