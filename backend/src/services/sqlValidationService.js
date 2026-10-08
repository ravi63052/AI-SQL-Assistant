function validateSql(sql) {
    if (!sql || typeof sql !== "string") {
        return {
            valid: false,
            message: "SQL query is empty"
        };
    }

    const normalizedSql = sql
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

    // Only SELECT queries are allowed
    if (!normalizedSql.startsWith("select ")) {
        return {
            valid: false,
            message: "Only SELECT queries are allowed"
        };
    }

    // Remove trailing semicolon for statement checking
    const sqlWithoutSemicolon = normalizedSql.replace(/;$/, "").trim();

    // Prevent multiple SQL statements
    if (sqlWithoutSemicolon.includes(";")) {
        return {
            valid: false,
            message: "Multiple SQL statements are not allowed"
        };
    }

    // Dangerous SQL keywords
    const forbiddenKeywords = [
        "insert",
        "update",
        "delete",
        "drop",
        "alter",
        "truncate",
        "create",
        "replace",
        "grant",
        "revoke"
    ];

    for (const keyword of forbiddenKeywords) {
        const pattern = new RegExp(`\\b${keyword}\\b`, "i");

        if (pattern.test(sqlWithoutSemicolon)) {
            return {
                valid: false,
                message: `Forbidden SQL operation detected: ${keyword}`
            };
        }
    }

    return {
        valid: true,
        message: "SQL query is valid"
    };
}

module.exports = {
    validateSql
};