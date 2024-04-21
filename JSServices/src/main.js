import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { getEnv } from './helpers/env.js';
import { PrismaClient } from '@prisma/client';
import { initRepositories } from './db/repositories/index.js';
import { initServices } from './services/index.js';
import { initControllers } from './controllers/index.js';
import { initRoutes } from './routes/index.js';
import { errorHandler } from './middlewares/ErrorHandler.js';

import * as dotenv from 'dotenv';
dotenv.config();

const PORT = getEnv('PORT') || 8000;

const main = async () => {
    const prismaClient = new PrismaClient();

    const repositories = initRepositories(prismaClient);

    const services = initServices(repositories);

    const controllers = initControllers(services);

    const routes = initRoutes(controllers);

    const app = express();

    app.use(cors())
        .use(json())
        .use(urlencoded({ extended: true }))
        .use(routes)
        .use(errorHandler)

        .listen(PORT, () => {
            console.log('Server listening on PORT:', PORT);
        });
};

main();