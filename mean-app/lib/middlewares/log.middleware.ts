import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (request: Request, response: Response, next: NextFunction) => {
    next();
};