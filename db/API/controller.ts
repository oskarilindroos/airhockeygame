import { model } from "./model.js";

export const controller = {
    getAllRooms: async (_: any, res: any) =>{
        try {
            const response = await model.getAllRooms();
            return res.status(200).json(response)
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: "Network or server error" });
        }
    }
}