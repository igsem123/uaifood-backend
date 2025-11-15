import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UaiFood API',
            version: '1.0.0',
            description: 'API documentation for UaiFood backend',
            contact: {
                name: 'UaiFood Support',
                email: 'uaifood@gmail.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
    },
    apis: [path.resolve(__dirname, '../controllers/*.ts')],
};

export const swaggerSpec = swaggerJSDoc(options);
