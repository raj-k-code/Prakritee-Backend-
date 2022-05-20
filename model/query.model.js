const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

const querySchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    gardenerId: {
        type: Schema.Types.ObjectId,
        ref: "gardener",
        default: null

    },
    nurseryId: {
        type: Schema.Types.ObjectId,
        ref: "nurseryOwner",
        default: null
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model("query", querySchema);