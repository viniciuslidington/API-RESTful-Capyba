import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Capyba Academy',
      version: '1.0.0',
      description: 'API documentation for Capyba Academy',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // ajuste conforme a estrutura do seu projeto
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
