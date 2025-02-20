const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = require('../src/docs/swagger.jsdoc.cjs'); // Adjust path if needed
const fs = require('fs');
const path = require('path');

const swaggerSpec = swaggerJsdoc(swaggerDefinition);
const outputPath = path.join(__dirname, '../public/swagger.json'); // Output to public for static serving

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`Swagger JSON generated at ${outputPath}`);