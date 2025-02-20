import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDefinition from '../../../../src/docs/swagger.jsdoc.cjs';

const swaggerSpec = swaggerJsdoc(swaggerDefinition);

export async function GET() { // GET handler to serve swagger.json
    return Response.json(swaggerSpec, { status: 200 });
}