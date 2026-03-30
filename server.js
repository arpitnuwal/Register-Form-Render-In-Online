const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
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
        res.status(500).send(error.message);
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log("FETCH ERROR:", error);
        res.status(500).send(error.message);
    }
});

// Start server only after DB connection
async function startServer() {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("MongoDB Connection Error:", error);
    }
}

startServer();