import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes"; // used for HTTP status codes

// Middleware to handle 404 errors
export const notFoundMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(StatusCodes.NOT_FOUND).json({
		error: ReasonPhrases.NOT_FOUND,
		message: `Cannot ${req.method} ${req.url}`,
	});
};
