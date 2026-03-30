    const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const User = require("./models/User");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.send("Registration successful");
    } catch (error) {
        res.send("Error saving user");
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});

        let html = `
        <html>
        <head>
            <title>User List</title>
            <style>
                body{
                    font-family: Arial;
                    padding:20px;
                }
                table{
                    width:100%;
                    border-collapse: collapse;
                }
                th,td{
                    border:1px solid #ddd;
                    padding:10px;
                    text-align:left;
                }
                th{
                    background:#f4f4f4;
                }
            </style>
        </head>
        <body>
            <h2>Registered Users</h2>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Password</th>
                </tr>
        `;

        users.forEach(user => {
            html += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                </tr>
            `;
        });

        html += `
            </table>
        </body>
        </html>
        `;

        res.send(html);
    } catch (error) {
        res.send("Error fetching users");
    }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});