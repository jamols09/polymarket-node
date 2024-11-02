import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes"; // used for HTTP status codes
import bcrypt from "bcrypt";

// Middleware to handle 404 errors
export const generateAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Get password from the request
	const password = req.body.credentials;

	// Throw error when there is no password included
	if (!password) {
		res.status(StatusCodes.UNAUTHORIZED).json({
			error: ReasonPhrases.UNAUTHORIZED,
			message: `Password is required`,
		});
	} else {
		// Check if the password is correct
		const salt = 5;
		const hashedPassword = await bcrypt.hash(password, salt);

		// Will expire 1 day from now
		res.cookie("hash", hashedPassword, {
			expires: new Date(Date.now() + 86400000),
			httpOnly: true,
		});

		next();
	}
};

export const validateAuthMiddleware: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Get the hashed password from the cookies
	let password = req.body.credentials;

	// If password is found in cookies, check the headers
	if (!password) {
		password = req.headers?.credentials;
	}

	const isMatch = await bcrypt.compare(password, req.cookies.hash);

	if (!isMatch) {
		res.status(StatusCodes.UNAUTHORIZED).json({
			error: ReasonPhrases.UNAUTHORIZED,
			message: `Unauthorized access`,
		});
	}

	next();
};
