const express = require("express");

const {
    generateQuery,
    getSchema,
    getFormattedSchema
} = require("../controllers/queryController");

const router = express.Router();

router.post("/", generateQuery);

router.get("/schema", getSchema);

router.get("/schema/formatted", getFormattedSchema);

module.exports = router;