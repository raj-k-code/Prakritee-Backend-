const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 3000;
const adminRouter = require("./routes/admin.router");

const app = express();

const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://raj-k-code:Mamta%4026@mongo-test.6wrm9.mongodb.net/PrakriteeDB?retryWrites=true&w=majority"
    )
    .then((result) => {
        console.log("Data base connnected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);

app.listen(port, () => {
    console.log("-----------SERVER IS STARTED-----------");
});