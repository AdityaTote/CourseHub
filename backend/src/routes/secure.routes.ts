import { Router, Response } from "express";
import { checkAdminAuth } from "../middlewares/adminAuth.middlewares";

export const secureAdminRoute = Router();

secureAdminRoute.get("/", checkAdminAuth, (req: any, res: Response) => {

    const admin = req.admin;

    if(!admin){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    return res.status(200).json({
        message: "Welcome to the secure route",
        admin
    })
})