const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
        min: 1
    },
    productDescription: {
        type: String,
        required: true,
    },
    productRating: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        rate: {
            type: Number,
            required: true,
            min: 1
        },
        date: {
            type: Date,
            default: new Date().now
        }
    }],
    productImage: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date().now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "nurseryOwner"
    }
});

module.exports = mongoose.model("product", productSchema);