import { wrap } from '../helpers/requests.js';
import { Router } from 'express';
import { NotAuthRoutes } from '../constants/enums/NotAuthRoutes.js';
import multer from 'multer';
import 'dotenv/config'

const upload = multer({ storage: multer.memoryStorage() });

const initNotAuthRoutes = (
    projectController
) => {
    const routes = Router();

    routes.post(
        NotAuthRoutes.PROCESS, upload.array('file'),
        wrap(projectController.process.bind(projectController)),
    );

    return routes
};

export { initNotAuthRoutes };