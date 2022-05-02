const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 3000;
const adminRouter = require("./routes/admin.router");
const gardenerRouter = require("./routes/gardener.router");
const productRouter = require("./routes/product.router");
const nurseryownerRouter = require("./routes/nurseryowner.router");
const userRouter = require("./routes/user.router");
const ejs = require("ejs");

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

app.set("view-engine", ejs)


app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);
app.use("/gardener", gardenerRouter);
app.use("/product", productRouter);
app.use("/nurseryowner", nurseryownerRouter);
app.use("/user", userRouter);

app.listen(port, () => {
    console.log("-----------SERVER IS STARTED-----------");
});