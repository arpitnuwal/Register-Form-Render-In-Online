const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const User = require("./models/User");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

console.log("Mongo URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("MongoDB Connection Error:", err);
});

app.post("/register", async (req, res) => {
    try {
        console.log("Form Data:", req.body);

        const { name, email, password } = req.body;

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.send("Registration successful");
    } catch (error) {
        console.log("SAVE ERROR:", error);
        res.send(error.message);
    }
});

app.get("/users", async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});