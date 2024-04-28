import { DatasetArchiveError, ArchiveSizeError, GDriveLoadingError } from '../exceptions/DatasetExceptions.js';
import 'dotenv/config'
import AdmZip from 'adm-zip';
import { google } from 'googleapis';
import fs from 'fs';
import axios from 'axios';

const PARENT_FOLDER = process.env.PARENT_FOLDER;

export class DataHandler {
    constructor(){
        this.drive = google.drive({ version: 'v3', auth: null });
    }

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

        if(zipEntries.length < 10 || zipEntries.length > 10000){
            throw new ArchiveSizeError();
        }
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
     
    async downloadFile2(link, destinationPath) {
        const fileId = this.extractFileId(link);
        if(!fileId){
            throw new GDriveLoadingError();
        }
        try {
          const response = await this.drive.files.get({
            fileId: fileId,
            alt: 'media'
          }, { responseType: 'stream' });
      
          return new Promise((resolve, reject) => {
            const dest = fs.createWriteStream(destinationPath);
            response.data
              .on('end', () => {
                resolve(filePath);
              })
              .on('error', err => {
                reject(err);
              })
              .pipe(dest);
          });
        } catch (error) {
            console.log(error)
          throw new GDriveLoadingError();
        }
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