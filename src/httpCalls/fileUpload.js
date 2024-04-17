import { uploadFile, uploadFiles } from '../utils/Constants';
import axios from '../utils/axios';


export const uploadFilePost = async (file,folder) => {
    try {

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        let { data } = await axios.post(uploadFile, formData);

        return data?.file_url ?? '';
    } catch (error) {
        console.log(error);
    }
}

export const uploadFilesPost = async (files, folder, removed) => {
    try {

        const formData = new FormData();

        // Append each file to the FormData object
        files.forEach(file => {
            formData.append('files', file);
        });
        
        formData.append('folder', folder);

        if (removed) {
            removed.forEach(rem => {
                formData.append('removed', rem)
            });
        }

        console.log(removed);
        
        let { data } = await axios.post(uploadFiles, formData);

        return data?.file_urls ?? [];
    } catch (error) {
        console.log(error);
    }
}
