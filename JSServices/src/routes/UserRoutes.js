import { wrap } from '../helpers/requests.js';
import { Router } from 'express';
import { UserRoutes } from '../constants/enums/UserRoutes.js';
import multer from 'multer';
import 'dotenv/config'
const PARENT_FOLDER = process.env.PARENT_FOLDER;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PARENT_FOLDER)
    },
    filename: function (req, file, cb) {
        cb(null, `${req.body?.Name}.zip`)
    }
});

const upload = multer({ storage: storage });

const initUserRoutes = (
    datasetController, userController, projectController, middleware
) => {
    const routes = Router();
    routes.use(middleware)

    //dataset
    routes.get(
        UserRoutes.GET_DATASETS,
        wrap(datasetController.getAll.bind(datasetController)),
    );

    routes.post(
        UserRoutes.CREATE_DATASET, upload.single('File'),
        wrap(datasetController.create.bind(datasetController)),
    );

    routes.delete(
        UserRoutes.DELETE_DATASET,
        wrap(datasetController.delete.bind(datasetController)),
    );


    //project
    routes.get(
        UserRoutes.GET_PROJECTS,
        wrap(projectController.getAll.bind(projectController)),
    );

    routes.delete(
        UserRoutes.DELETE_PROJECT,
        wrap(projectController.delete.bind(projectController)),
    );

    //user
    routes.get(
        UserRoutes.GET_CURRENT_USER,
        wrap(userController.getById.bind(userController)),
    );

    routes.put(
        UserRoutes.UPDATE_CURERENT_USER,
        wrap(userController.update.bind(userController)),
    );

    return routes
};

export { initUserRoutes };