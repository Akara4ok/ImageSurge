import 'dotenv/config'
const PARENT_FOLDER = process.env.PARENT_FOLDER;

export const getDatasetPath = (name) => {
    return PARENT_FOLDER + "/" + name + ".zip";
}