const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

const nurseryOwnerSchema = new mongoose.Schema({
    nurseryName: {
        type: String,
        required: true,
    },
    nurseryOwnerName: {
        type: String,
        required: true,
    },
    nurseryOwnerEmail: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    nurseryOwnerPassword: {
        type: String,
        required: true,
    },
    nurseryOwnerMobile: {
        type: Number,
        required: true,
        unique: true,
        length: 10
    },
    nurseryAddress: {
        type: String,
        required: true,
    },
    Image: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUeHA9ISQ12axJyzB-gBv30kicd4mfCeR7AQ&usqp=CAU"
    },
    JoinDate: {
        type: Date,
        default: Date.now
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    isBlock: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("nurseryOwner", nurseryOwnerSchema);