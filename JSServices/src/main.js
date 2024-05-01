import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { getEnv } from './helpers/env.js';
import { PrismaClient } from '@prisma/client';
import { initRepositories } from './db/repositories/index.js';
import { initServices } from './services/index.js';
import { initControllers } from './controllers/index.js';
import { initCrudRoutes } from './routes/CrudRoutes.js';
import { initAuthRoutes } from './routes/AuthRoutes.js';
import { initUserRoutes } from './routes/UserRoutes.js';
import { errorHandler } from './middlewares/ErrorHandler.js';
import { ioServer } from './wssocket/wssocket.js';
import { initTestRoutes } from './routes/TestRoutes.js';

import * as dotenv from 'dotenv';
import { authMiddleware } from './middlewares/AuthMiddleware.js';
import { initNotAuthRoutes } from './routes/NotAuthRoutes.js';
dotenv.config();

const PORT = getEnv('PORT') || 8000;

const main = async () => {
    const prismaClient = new PrismaClient();

    const repositories = initRepositories(prismaClient);

    const services = initServices(repositories);

    const controllers = initControllers(services);

    // console.log(controllers)

    const crudRoutes = initCrudRoutes(controllers);
    const authRoutes = initAuthRoutes(controllers.userController);
    const notAuthRoutes = initNotAuthRoutes(controllers.projectController);
    const userRoutes = initUserRoutes(controllers.datasetController, controllers.userController, controllers.projectController, authMiddleware);
    const testRoutes = initTestRoutes();

    const app = express();

    const server = app.use(cors())
        .use(json())
        .use(urlencoded({ extended: true }))
        .use(testRoutes)
        .use(notAuthRoutes)
        .use(authRoutes)
        .use("/", userRoutes)
        .use(crudRoutes)
        .use(errorHandler)

        .listen(PORT, () => {
            console.log('Server listening on PORT:', PORT);
        });
    
    
    ioServer.attach(server)
};

main();