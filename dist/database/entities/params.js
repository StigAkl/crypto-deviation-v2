const _mongoose = require("mongoose");
const paramsSchema = new _mongoose.Schema({
    name: {
        type: String,
        default: "CryptoBotParams",
        unique: true,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
});
const Params = _mongoose.model("Params", paramsSchema, "params");
module.exports = Params;
//# sourceMappingURL=params.js.map