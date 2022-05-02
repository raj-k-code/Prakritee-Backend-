const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true,
    },
    userMobile: {
        type: Number,
        required: true,
        unique: true,
        length: 10
    },
    userAddress: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyw551VPZXNStb2o_1PS7LJpIVrR-qbwqyDuBj6m4Xa3ePEE9DqQVB2_U9JsMoPKRrhHE&usqp=CAU"
    },
    userJoinDate: {
        type: Date,
        default: new Date().now
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

module.exports = mongoose.model("user", userSchema);