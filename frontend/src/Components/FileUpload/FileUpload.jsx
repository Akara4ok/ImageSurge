import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import './FileUpload.scss'

const fileTypes = ["ZIP"];

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    console.log(file)
    setFile(file);
  };
  return (
    <>
        <FileUploader handleChange={handleChange} label="Drop zip file here or browse" classes="width-class" name="file" types={fileTypes} />
        <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p>
    </>
  );
}

export default FileUpload;
