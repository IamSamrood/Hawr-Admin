import { getAppointment } from '../utils/Constants';
import axios from '../utils/axios';



export const getAppoinments = async () => {
    try {
       
        let { data } = await axios.get(getAppointment);
        
        return data?.appointments ?? [];
    } catch (error) {
        console.log(error);
    }
}

export const changeAppointmentStatus = async (status, id) => {
    try {
        let { data } = await axios.put(`/appointment/${id}/status`, {
            status,
        });
        return data.message;
    } catch {
        console.log(error);
    }
}