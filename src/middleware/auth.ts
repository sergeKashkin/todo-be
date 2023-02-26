import { Request, Response, NextFunction } from "express";

export const authHandler = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(403);
        throw new Error("Unauthorized");
    }
    else {
        next();
    }
};