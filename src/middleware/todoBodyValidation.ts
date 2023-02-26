import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const todoBodyValidation = () => {
    return [
        body("name").exists().notEmpty().isString(),
        body("description").exists().notEmpty().isString(),
        body("isCompleted").exists().notEmpty().isBoolean(),
        body("isInEdit").exists().notEmpty().isBoolean(),
    ];
};

export const todoBodyValidationResult = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array().join("\n"));
    }
};