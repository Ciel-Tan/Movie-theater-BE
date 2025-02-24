const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Movie Theater API',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Bearer token to access protected endpoints'
                }
            }
        },
    },
    apis: [
        // path.join(__dirname, '../../app/api/**/route.js')
        path.join(__dirname, '../services/**/*.js'), // Scan JSDoc in service files (all services)
        path.join(__dirname, '../pages/api/**/*.js'), // Scan JSDoc in API route files
    ],
};  

module.exports = options;