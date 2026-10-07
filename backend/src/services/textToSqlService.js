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

function generateSql(question, schema) {
    const normalizedQuestion = question.toLowerCase().trim();

    if (normalizedQuestion === "show all employees") {
        return "SELECT * FROM employees;";
    }

    if (normalizedQuestion === "show all departments") {
        return "SELECT * FROM departments;";
    }

    throw new Error("Question is not supported yet.");
}

module.exports = {
    generateSql,
    formatSchemaForAI
};