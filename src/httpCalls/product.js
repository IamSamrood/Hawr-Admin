import { addNewProduct, getProduct } from '../utils/Constants';
import axios from '../utils/axios';


export const getProducts = async (page, limit) => {
    try {

        let { data } = await axios.post(`${getProduct}?page=${page}&limit=${limit}`);

        return data;
    } catch (error) {
        console.log(error);
    }
}

export const addProductPost = async (data) => {
    try {

        let res = await axios.post(addNewProduct, data);

        console.log(res);
        
    } catch (error) {
        console.log(error);
    }
}

export const editProductPut = async (data) => {
    try {

        let res = await axios.put(addNewProduct, data);

        console.log(res);

    } catch (error) {
        console.log(error);
    }
}