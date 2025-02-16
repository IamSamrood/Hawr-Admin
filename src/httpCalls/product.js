import { addNewProduct, getProduct } from '../utils/Constants';
import axios from '../utils/axios';

export const getProducts = async (page, limit) => {
    try {
        let { data } = await axios.get(`${getProduct}?page=${page}&limit=${limit}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const addProductPost = async (data) => {
    try {
        await axios.post(addNewProduct, data);
    } catch (error) {
        console.log(error);
    }
}

export const editProductPut = async (data) => {
    try {
        await axios.put(addNewProduct, data);
    } catch (error) {
        console.log(error);
    }
}

export const deleteProduct = async (productId) => {
    try {
        const res = await axios.delete(`/product/${productId}`);
        return;
    } catch (error) {
        console.log(error);
    }
}
