import React, { useState } from "react";
import { Upload, Button, message, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import './Admin.css';
import {url} from './url';

const FileUpload = () => {
    const [studentsFile, setStudentsFile] = useState(null);
    const [courseListFile, setCourseListFile] = useState(null);

    const handleFileUpload = (file, setFile) => {
        setFile(file);
        message.success(`${file.name} selected successfully!`);
        return false;
    };

    const uploadFiles = async () => {
        if (!studentsFile || !courseListFile) {
            message.error("Please upload both files!");
            return;
        }

        const formData = new FormData();
        formData.append("studentDetailsFile", studentsFile);
        formData.append("courseListFile", courseListFile);

        try {
            const response = await fetch(`${url}/admin/upload`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                message.success("Files uploaded successfully!");
            } else {
                message.error("Failed to upload files. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading files:", error);
            message.error("An error occurred while uploading.");
        }
    };

    return (
        <div className="admin-container"
        style={{padding:'30px'}}>
            <h3>Upload CSV Data</h3>

            <Alert
                message="CSV Structure for Students Data"
                description={
                    <p>
                        stdName,stdId,email,phNo,sem,year,DOB, courseList
                        
                    </p>
                }
                type="info"
                className="mb-3"
            />

            <Upload
                accept=".csv"
                beforeUpload={(file) => handleFileUpload(file, setStudentsFile)}
            >
                <Button icon={<UploadOutlined />}>Upload Students Data CSV</Button>
            </Upload>

            <Alert
                message="CSV Structure for Course List Data"
                description={
                    <p>
                        coursecode, coursename, questions
                        
                    </p>
                }
                type="info"
                className="mt-3 mb-3"
            />

            <Upload
                accept=".csv"
                beforeUpload={(file) => handleFileUpload(file, setCourseListFile)}
            >
                <Button icon={<UploadOutlined />} >Upload Course List CSV</Button>
            </Upload>

            <div className="mt-3">
                <Button type="primary" onClick={uploadFiles}>
                    Submit Files
                </Button>
            </div>
        </div>
    );
};

export default FileUpload;
