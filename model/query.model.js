const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

const querySchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    queryText: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model("query", querySchema);