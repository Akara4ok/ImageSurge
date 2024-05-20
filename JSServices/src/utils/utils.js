import 'dotenv/config'
const PARENT_FOLDER = process.env.PARENT_FOLDER;
const DOCKER_FOLDER = process.env.DOCKER_FOLDER;

export const getDatasetPath = (name) => {
    return PARENT_FOLDER + "/" + name + ".zip";
}

export const getDockerDatasetPath = (name) => {
    return DOCKER_FOLDER + name + ".zip";
}