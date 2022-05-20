const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    gardenerId: {
        type: Schema.Types.ObjectId,
        ref: "gardener"
    },
    bookRequests: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            default: null
        },
        nurseryId: {
            type: Schema.Types.ObjectId,
            ref: "nurseryOwner",
            default: null
        },

        isApproved: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model("booking", bookingSchema);