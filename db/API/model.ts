import {execute} from "./pool.js"

export const model = {
    getAllRooms: async () =>{
        try {
            return execute('SELECT * FROM `roomTable`');
        } catch (error) {
            throw error;
        }

    }
}