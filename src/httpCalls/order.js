import { getOrder, updateStatus } from '../utils/Constants';
import axios from '../utils/axios';


export const getOrders = async (page, limit) => {
    try {

        let { data } = await axios.get(`${getOrder}?page=${page}&limit=${limit}`);

        return data;
    } catch (error) {
        console.log(error);
    }
}

export const updateOrderStatus = async (status, id) => {
    try {
        let { data } = await axios.put(`${updateStatus}/${id}`,{status});

        return data;
    } catch (error) {
        console.log(error);
    }
}