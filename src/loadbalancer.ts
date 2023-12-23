import express from "express";
import { UserRoutes } from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { UserService } from "./services";
import cluster from "cluster";
import os from "os";
import { InMemoryDatabase } from "./database";

const userRoutes = new UserRoutes(new UserService());
const app = express();
const PORT: any = process.env.PORT || 4000;

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

if (cluster.isPrimary) {
  // Start the data manager in the primary process
  const dataManager = InMemoryDatabase.getInstance();

  // Set the shared instance in the primary process
  InMemoryDatabase.setInstance(dataManager);

  for (let i = 0; i < os.cpus().length - 1; i++) {
    const workerPort = PORT + i;
    cluster.fork({ workerPort });
  }

  // Attach the shared in-memory database to the worker
  if (dataManager) {
    app.set("inMemoryDB", dataManager);
  }
} else {
  const workerPort = process.env.workerPort || PORT;

  // Access the shared in-memory database instance directly
  InMemoryDatabase.getInstance();

  //Listening all Ports with swagger UI endpoint (CLICK SwaggerUI endpoint for API documentations)
  app.listen(workerPort, () => {
    console.log(
      `Worker ${cluster.worker?.id} is running on http://localhost:${workerPort}, SwaggerUI on  http://localhost:${workerPort}/api-docs `
    );
  });
}
