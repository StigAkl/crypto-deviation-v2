const mongoose = require("mongoose");
const currencySchema = new mongoose.Schema({
    name: {
        type: "String",
        required: true,
        trim: true,
        unique: true,
    },
    marketName: {
        type: "String",
        required: true,
        trim: true,
        unique: true,
    },
    lastTriggeredBand: {
        type: Map,
    },
});
const Currency = mongoose.model("Currency", currencySchema, "crypto_currencies");
module.exports = Currency;
//# sourceMappingURL=currency.js.map