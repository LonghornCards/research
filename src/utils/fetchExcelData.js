import axios from 'axios';
import * as XLSX from 'xlsx';

export const fetchExcelData = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        return jsonData;
    } catch (error) {
        console.error('Error fetching and parsing Excel data:', error);
        throw error;
    }
};
