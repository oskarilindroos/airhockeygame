import {modifyData, selectData} from "./pool.js"

export const model = {

    createRoom: async (url: string) => {
        try {
            const query =
                'INSERT INTO `roomTable` (`url`) \
                VALUES (?)';

                return modifyData(query, [url]);
        } catch (error: any) {
            throw error;
        }
    },

    deleteRoom: async (roomID: string) => {
        try {
            const query =
                'DELETE FROM `roomTable` \
                WHERE `roomID` = ?';

            return modifyData(query, [roomID]);

        } catch (error: any) {
            throw error;
        }
    },

    getAllRooms: async () =>{
        try {
            const query =
                'SELECT `roomID`, `url`, `createdAt`, `status` \
                FROM `roomTable` JOIN `status` \
                ON `roomTable`.`statusID` = `status`.`statusID`';

            return selectData(query);

        } catch (error: any) {
            throw error;
        }
    },

    getRoomByID: async (roomID: string) => {
        try {
            const query =
                'SELECT `roomID`, `url`, `createdAt`, `status` \
                FROM `roomTable` JOIN `status` \
                ON `roomTable`.`statusID` = `status`.`statusID` \
                WHERE roomID = ?';

            return selectData(query, [roomID]);

        } catch (error: any) {
            throw error;
        }
    },

    updateRoomStatus: async (roomID: string, statusID: string) => {
        try {
            const query =
                'UPDATE `roomTable` \
                SET `statusID` = ? \
                WHERE `roomID` = ?';

            return modifyData(query, [statusID, roomID]);

        } catch (error: any) {
            throw error;
        }
    }
}