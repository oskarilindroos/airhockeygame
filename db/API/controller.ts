import { Request, Response } from "express";
import { model } from "./model.js";

export const controller = {

    createRoom: async (req: Request, res: Response): Promise<any> => {
        try {
            const { url } = req.body;
            const response = await model.createRoom(url);
            return res.status(201).json({message: "Room created"});

        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: "Network or server error" });
        }
    },

    deleteRoom: async (req: Request, res: Response): Promise<any> => {
        try {
            const { roomID } = req.params;
            const response = await model.deleteRoom(roomID);

/*             if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Room not found" });
            } */

            return res.status(200).json({ message: "Room deleted successfully" });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: "Network or server error" });
        }
    },

    getAllRooms: async (_: Request, res: Response): Promise<any> =>{
        try {
            const response = await model.getAllRooms();
            return res.status(200).json(response)
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: "Network or server error" });
        }
    },

    getRoomById: async (req: Request, res: Response): Promise<any> => {
        try {
            const { roomID } = req.params;
            const response = await model.getRoomByID(roomID);
            return res.status(200).json(response);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: "Network or server error" });
        }
    },

    updateRoomStatus: async (req: Request, res: Response): Promise<any> => {
        try {
            const { roomID } = req.params;
            const { statusID } = req.body;

            const result = await model.updateRoomStatus(roomID, statusID);

/*             if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Room not found" });
            } */

            return res.status(200).json({ message: `Room ${roomID} status updated to ${statusID}` });
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: "Network or server error" });
        }
    }
}