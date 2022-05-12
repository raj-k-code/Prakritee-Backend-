const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true,
    },
    blogContent: {
        type: String,
        required: true,
    },
    blogImage: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "nurseryOwner"
    }
});

module.exports = mongoose.model("blog", blogSchema);