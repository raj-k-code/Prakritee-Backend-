const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

const favSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    productList: [{
        type: Schema.Types.ObjectId,
        ref: "product"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("fav", favSchema);