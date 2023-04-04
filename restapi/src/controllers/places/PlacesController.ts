import {Request, Response} from "express";

const getPlaces = async (req: Request, res: Response): Promise<void> => {
    res.status(200);
}
export { getPlaces }