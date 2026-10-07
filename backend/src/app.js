const express = require("express");
const cors = require("cors");

const queryRoutes = require("./routes/queryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/query", queryRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Text-to-SQL backend is running"
    });
});

module.exports = app;