import { Router } from 'express';
import axios from 'axios';
// import fs from 'fs'
import { createReadStream } from 'node:fs';
import { blob } from 'node:stream/consumers';
import { fileFromSync } from "fetch-blob/from.js";
import fs from 'node:fs'

const initTestRoutes = () => {
    const routes = Router();

    routes.get("/test_load", async (req, res) => {
        try{
            const response = await axios({
                url: "http://localhost:5000/load",
                method:"POST",
                data: {
                    "user": "test",
                    "project": "test",
                    "experiment": "test",
                    "cropping": true,
                    "kserve-path-classification": "http://kserve-cloud.team-1.shpylka.arestai.com/v1/models/resnet50:predict",
                    "kserve-path-crop": "http://kserve-cloud.team-1.shpylka.arestai.com/v1/models/resnet50:predict",
                    "local-kserve": false
                }
            })
            console.log("response");
            console.log(response.data);
        } catch(error) {
            console.log("error");
        }
        return res.status(200).json({});
    });

    routes.get("/test_process", async (req, res) => {
        try{
            const formData = new FormData();
            formData.append('user', 'test');
            formData.append('project', 'test');
            formData.append('experiment', 'test');
            formData.append('cropping', "True");
            formData.append('level', 15);
            formData.append('postprocessing', '["flip H", "resize 600 600", "toColorSpace GRAY"]');
            formData.append('file', await fs.openAsBlob("../Data/cat/cat1.jpg", { type: 'image/jpg' }), "cat1.jpg");
            formData.append('file', await fs.openAsBlob("../Data/cat/cat3.jpg", { type: 'image/jpg' }), "cat1.jpg");

            const response = await axios({
                url: "http://localhost:5000/process",
                method:"post",
                data: formData,
            })
            console.log("response");
            console.log(response.data);
            return res.status(200).json({});

        } catch(error) {
            console.log("error");
            console.log(error.response?.data ?? error);
            return res.status(500).json(error.response?.data ?? error);
        }
    });
    return routes;
}

export {initTestRoutes}