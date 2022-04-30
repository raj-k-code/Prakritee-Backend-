const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

const gardenerSchema = new mongoose.Schema({
    gardenerName: {
        type: String,
        required: true,
    },
    gardenerEmail: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    gardenerPassword: {
        type: String,
        required: true,
    },
    gardenerMobile: {
        type: Number,
        required: true,
        unique: true,
        length: 10
    },
    gardenerAddress: {
        type: String,
        required: true,
    },
    gardenerImage: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUeHA9ISQ12axJyzB-gBv30kicd4mfCeR7AQ&usqp=CAU"
    },
    gardenerJoinDate: {
        type: Date,
        default: new Date().now
    },
    gardenerExperience: {
        type: String,
        required: true,
    },
    gardenerRating: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        rate: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    isVerify: {
        type: boolean,
        default: false
    },
    isBlock: {
        type: boolean,
        default: true
    },
});

module.exports = mongoose.model("gardener", gardenerSchema);