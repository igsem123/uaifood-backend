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
                url: 'http://localhost:3333/api',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.resolve(__dirname, '../controllers/*.ts')],
};

export const swaggerSpec = swaggerJSDoc(options);
