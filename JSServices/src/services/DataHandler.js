import { DatasetArchiveError, ArchiveSizeError, GDriveLoadingError } from '../exceptions/DatasetExceptions.js';
import AdmZip from 'adm-zip';
import fs, { existsSync } from 'fs';
import axios from 'axios';
import path from 'path';

export const MIN_IMG = 100;

export class DataHandler {
    checkZipFile(zipPath) {
        let zip;
        try{
            zip = new AdmZip(zipPath);
            if(!zip){
                throw new DatasetArchiveError();
            }
        } catch(error) {
            console.log(zipPath);
            console.log(error)
            throw new DatasetArchiveError();
        }

        const zipEntries = zip.getEntries();

        let directoryCount = 0;
        zipEntries.forEach((entry) => {
            if (entry.isDirectory) {
                directoryCount++;
            } else {
                if (!entry.entryName.match(/\.(jpg|png|jpeg)$/i)) {
                    throw new DatasetArchiveError();
                }
            }
        });

        if(directoryCount > 1){
            throw new DatasetArchiveError();
        }

        if(zipEntries.length < MIN_IMG || zipEntries.length > 10000){
            throw new ArchiveSizeError();
        }
        return zipEntries.length - directoryCount
    }

    extractAll(path, folder, dataset_name){
        const save_path = folder + "/" + dataset_name;
        if(existsSync(save_path)){
            throw new DatasetArchiveError();
        }
        if(!path.endsWith(".zip")){
            throw new DatasetArchiveError()
        }
        const zip = new AdmZip(path);
        const zipEntries = zip.getEntries();
        let directoryEntry = null;
        zipEntries.forEach((entry) => {
            if (entry.isDirectory) {
                directoryEntry = entry;
            }
        });
        try{
            if(directoryEntry){
                zip.extractEntryTo(directoryEntry.entryName, save_path, false, false, false, dataset_name);
            } else {
                zip.extractAllTo(save_path);
            }
        } catch(error) {
            console.log(error)
            throw new DatasetArchiveError();
        }
    }

    deleteLowQualityImgs(directoryPath, filesToKeep){
        const files = fs.readdirSync(directoryPath);
        files.forEach(file => {
            if (!filesToKeep.includes(file)) {
                const filePath = path.join(directoryPath, file);
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    fs.unlinkSync(filePath);
                }
            }
        });
    }

    extractFileId(url) {
        const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (fileIdMatch) {
          return fileIdMatch[1];
        }
      
        const paramIdMatch = url.match(/id=([a-zA-Z0-9-_]+)/);
        if (paramIdMatch) {
          return paramIdMatch[1];
        }
      
        return undefined;
    }

    async downloadFile(link, dest){
        const fileId = this.extractFileId(link);
        console.log(fileId)
        if(!fileId){
            throw new GDriveLoadingError();
        }
        const url = `https://drive.google.com/uc?export=download&id=${fileId}`
        const file = fs.createWriteStream(dest);

        return new Promise(async (resolve, reject) => {

            try {
                const response = await axios({url, method:"GET", responseType: 'stream'});
                response.data?.pipe(file);
                file.on('finish', () => {file.close(), resolve(true)});
                file.on('error', (err) => { // Handle errors
                    fs.unlink(dest); // delete the (partial) file and then return the error
                    throw new GDriveLoadingError();
                });
            } catch (error) {
                console.error(error);
                throw new GDriveLoadingError();
            }   
        })
    };
}