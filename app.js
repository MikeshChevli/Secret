require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);


app.route("/")

    .get(function (req, res) {
        res.render("home");
    });

app.route("/login")

    .get(function (req, res) {
        res.render("login");
    })

    .post(function (req, res) {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ email: username })
            .then(function (founduser) {
                if (founduser) {
                    if (founduser.password === password) {
                        res.render("secrets");
                    };
                };
            })
            .catch(function (err) {
                console.log(err);
            });
    });

app.route("/register")

    .get(function (req, res) {
        res.render("register");
    })

    .post(function (req, res) {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save()
            .then(function () {
                res.render("secrets")
            })
            .catch(function () {
                console.log("Error while saving data");
            });
    });





app.listen(PORT, function () {
    console.log("Server started on port " + PORT);
});