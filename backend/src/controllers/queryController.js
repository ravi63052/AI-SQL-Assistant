const {
    generateSql,
    formatSchemaForAI
} = require("../services/textToSqlService");

const {
    getDatabaseSchema
} = require("../services/databaseService");

async function generateQuery(req, res) {
    try {
        const { question } = req.body || {};

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        const schema = await getDatabaseSchema();

        const sql = generateSql(question, schema);

        res.json({
            success: true,
            question: question,
            sql: sql
        });

    } catch (error) {
        console.error("Text-to-SQL error:", error.message);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getSchema(req, res) {
    try {
        const schema = await getDatabaseSchema();

        res.json({
            success: true,
            database: process.env.DB_NAME,
            schema: schema
        });

    } catch (error) {
        console.error("Schema error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve database schema"
        });
    }
}

async function getFormattedSchema(req, res) {
    try {
        const schema = await getDatabaseSchema();

        const formattedSchema = formatSchemaForAI(schema);

        res.json({
            success: true,
            database: process.env.DB_NAME,
            schema: formattedSchema
        });

    } catch (error) {
        console.error("Formatted schema error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to format database schema"
        });
    }
}

module.exports = {
    generateQuery,
    getSchema,
    getFormattedSchema
};