import express from 'express';
import {UserRoutes} from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { UserService } from './services';

const app = express();
const PORT = 3000;

const userRoutes = new UserRoutes(new UserService());

// Serve Swagger UI
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'API documentation for your Express application',
    },
  },
  apis: ['./src/routes/user.routes.ts']
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(userRoutes.setupRoutes());





app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
