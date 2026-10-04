const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get("/", (req, res) => {
    res.json({
        message: "Text-to-SQL Backend is running"
    });
});

app.get("/api/db-test", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");

        res.json({
            success: true,
            message: "Database connection successful",
            data: rows
        });

 } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message
    });
}
});

module.exports = { app, db };