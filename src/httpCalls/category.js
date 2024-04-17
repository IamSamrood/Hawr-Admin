import { addNewCategory, getAllCategory, getCategory } from '../utils/Constants';
import axios from '../utils/axios';


export const getCategories = async (page,limit) => {
    try {

        let { data } = await axios.get(`${getCategory}?page=${page}&limit=${limit}`);
        
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const addCategoryPost = async (data) => {
    try {

        let res = await axios.post(addNewCategory, data);

        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

export const editCategoryPut = async (id,data) => {
    try {

        let res = await axios.put(`${addNewCategory}/${id}`, data);

        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

export const getAllCategories = async () => {
    try {

        let { data } = await axios.get(getAllCategory);

        return data.categories ?? [];
    } catch (error) {
        console.log(error);
    }
}
