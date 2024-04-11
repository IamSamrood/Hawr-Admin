import { addNewCoupon, getCoupon } from '../utils/Constants';
import axios from '../utils/axios';


export const getCoupons = async (page, limit) => {
    try {

        let { data } = await axios.get(`${getCoupon}?page=${page}&limit=${limit}`);

        return data;
    } catch (error) {
        console.log(error);
    }
}

export const addCouponPost = async (data) => {
    try {

        let res = await axios.post(addNewCoupon, data);

        return res.data;
    } catch (error) {
        console.log(error);
    }
}


