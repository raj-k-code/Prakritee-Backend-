const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

const favSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    productList: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "product",
            unique:true
        }
    }],
    createdAt: {
        type: Date,
        default: new Date().now
    },

});

module.exports = mongoose.model("fav", favSchema);