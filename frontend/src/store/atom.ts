import { BACKEND_URL } from '@/utils';
import axios from 'axios';
import { atom, selector } from 'recoil';

export const adminCourseAtom = atom({
    key: 'adminCourseAtom',
    default: selector({
        key:'adminCourseSelector',
        get: async() => {
            try{
                const response = await axios.get(`${BACKEND_URL}/api/v1/admin/courses`,{ withCredentials: true })
                if(response){
                    return response.data.data
                } else {
                    // @ts-igonre
                    return response.error.data.message
                }
            } catch(e){
                console.log(e);
            }
        }
    })
})