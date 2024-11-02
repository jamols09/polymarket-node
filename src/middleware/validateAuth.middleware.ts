import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes"; // used for HTTP status codes
import bcrypt from "bcrypt";

// Middleware to handle credentials
export const validateAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const password = req.headers["credentials"] as string;

	// Check if password is provided
	if (!password) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: "Bad Request",
			message: "Credentials are required",
		});
		return;
	}

	const isMatch = await bcrypt.compare(password, req.cookies.hash);

	// Check if password is correct
	if (!isMatch) {
		res.status(StatusCodes.UNAUTHORIZED).json({
			error: ReasonPhrases.UNAUTHORIZED,
			message: `Unauthorized access`,
		});
		return;
	}

	next();
};
