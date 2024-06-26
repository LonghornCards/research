import { Storage } from 'aws-amplify';
import awsconfig from './aws-exports'; // Adjust the path according to your project structure

// Configure Amplify with the AWS config
Amplify.configure(awsconfig);

// Function to get URL
const getUrl = async (filename: string) => {
    try {
        const url = await Storage.get(filename, { level: 'protected' });
        console.log('File URL:', url);
    } catch (error) {
        console.log('Error getting file URL:', error);
    }
};

// Function to upload data
const uploadData = async (filename: string, file: any) => {
    try {
        const result = await Storage.put(filename, file, { level: 'protected' });
        console.log('Upload succeeded:', result);
    } catch (error) {
        console.log('Error uploading file:', error);
    }
};

// Function to remove data
const removeData = async (filename: string) => {
    try {
        await Storage.remove(filename, { level: 'protected' });
        console.log('File removed');
    } catch (error) {
        console.log('Error removing file:', error);
    }
};

// Function to list data
const listData = async (prefix: string) => {
    try {
        const result = await Storage.list(prefix, { level: 'protected' });
        console.log('List of files:', result);
    } catch (error) {
        console.log('Error listing files:', error);
    }
};
