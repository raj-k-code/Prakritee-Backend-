const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Mobile: {
        type: Number,
        required: true,
        length: 10
    },
    Address: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    productList: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "product"
        },
        qty: {
            type: Number,
            default: 1
        }
    }],
    createdAt: {
        type: Date,
        default: new Date().now
    },
    orderStatus: {
        type: String,
        default: "shipped"
    },
    total: {
        type: Number,
        required: true
    },

});

module.exports = mongoose.model("order", orderSchema);