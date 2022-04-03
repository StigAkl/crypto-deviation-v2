"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const currency_database_1 = require("../database/currency_database");
const marketService_1 = require("../market/marketService");
require("dotenv").config();
const loadMarketsToJson = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("running");
    const markets = yield (0, marketService_1.GetMarkets)();
    (0, currency_database_1.LoadCurrenciesToJson)(markets, true);
});
loadMarketsToJson();
//# sourceMappingURL=storeMarketsInJson.js.map