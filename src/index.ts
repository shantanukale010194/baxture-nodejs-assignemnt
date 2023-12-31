import express from "express";
import { UserRoutes } from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { UserService } from "./services";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes = new UserRoutes(new UserService());

// Serve Swagger UI
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Baxture nodejs assignment with Swagger UI",
      version: "1.0.0",
      description: "baxture-nodejs-assignemnt",
    },
  },
  apis: ["./src/routes/user.routes.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(userRoutes.setupRoutes());

export default app;

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}, SwaggerUI on  http://localhost:${PORT}/api-docs`
  );
});
