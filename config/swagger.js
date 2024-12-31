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
                url: "http://localhost:3000", // Local server URL
                description: "Local development server", // Description for local server
            },
            {
                url: "https://bus-seats-booking-system-ntc-backend.up.railway.app", // Deployed server URL
                description: "Deployed server (Railway app)", // Description for deployed server
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

// Add the log here to inspect the swaggerSpec object
console.log(swaggerSpec);

module.exports = swaggerSpec;
