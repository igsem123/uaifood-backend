import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase, ReasonPhrases } from 'http-status-codes';

export interface AppError extends Error {
    status?: number;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message || getReasonPhrase(ReasonPhrases.INTERNAL_SERVER_ERROR),
    });
};