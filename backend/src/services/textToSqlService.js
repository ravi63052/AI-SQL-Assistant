const { GoogleGenAI } = require("@google/genai");

require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

function formatSchemaForAI(schema) {
    let schemaText = "";

    for (const tableName in schema) {
        schemaText += `Table: ${tableName}\n`;

        for (const column of schema[tableName]) {
            schemaText += `- ${column.column} (${column.type})\n`;
        }

        schemaText += "\n";
    }

    return schemaText;
}

async function generateSql(question, schema) {
    const schemaText = formatSchemaForAI(schema);

    const prompt = `
You are a Text-to-SQL assistant.

Your job is to convert a user's natural language question into a valid MySQL SELECT query.

Database schema:

${schemaText}

User question:

${question}

Rules:
1. Generate only SELECT queries.
2. Use only tables and columns provided in the database schema.
3. Do not invent table names.
4. Do not invent column names.
5. Do not generate INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, CREATE, or any other non-SELECT statement.
6. Return only the SQL query.
7. Do not use markdown code fences.
8. The SQL must use valid MySQL syntax.
9. If the question cannot be answered using the provided schema, return exactly:
UNSUPPORTED
`;

    const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        contents: prompt
    });

    const sql = response.text.trim();

    return sql;
}

module.exports = {
    generateSql,
    formatSchemaForAI
};