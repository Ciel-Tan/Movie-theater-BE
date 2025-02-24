import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDefinition from '../../../docs/swagger.jsdoc.js';

const swaggerSpec = swaggerJsdoc(swaggerDefinition);

export async function GET() { // GET handler to serve swagger.json
    return Response.json(swaggerSpec, { status: 200 });
}