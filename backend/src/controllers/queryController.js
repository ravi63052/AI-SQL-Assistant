const {
    generateSql,
    formatSchemaForAI
} = require("../services/textToSqlService");

const {
    getDatabaseSchema,
    executeQuery
} = require("../services/databaseService");

const {
    validateSql
} = require("../services/sqlValidationService");

async function generateQuery(req, res) {
    try {
        const { question } = req.body || {};

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        //get database schema
        const schema = await getDatabaseSchema();

        //ask gemini to generate sql
        const sql = await generateSql(question, schema);


        //check if gemini could not answer
        if (sql === "UNSUPPORTED") {
            return res.status(400).json({
                success: false,
                message: "The question cannot be answered using the available database schema."
            });
        }

        //validate generated SQl
        const validation = validateSql(sql);

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        const results = await executeQuery(sql);

        //return generated sql
        res.json({
            success: true,
            question: question,
            sql: sql,
            results:results
        });

    } catch (error) {
        console.error("Text-to-SQL error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to generate SQL"
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