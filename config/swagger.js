const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "National Transport Commission of Sri Lanka API",
            version: "1.0.0",
            description: "API documentation for NTC backend",
        },
        servers: [
            {
                url: process.env.SWAGGER_SERVER_URL || "http://localhost:3000", // Use Railway variable or fallback to localhost
                description: "Deployed server",
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

// Add the log here to inspect the swaggerSpec object
console.log(swaggerSpec);

module.exports = swaggerSpec;
