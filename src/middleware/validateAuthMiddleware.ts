import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes"; // used for HTTP status codes
import bcrpyt from "bcrypt";
import { hash } from "crypto";
import UserHashModel from "../models/user_hash.model";

// Middleware to handle 404 errors
export const validateAuthMiddleware = async (
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
		const hashedPassword = await bcrpyt.hash(password, salt);
		UserHashModel.saveUserHash({ credentials: hashedPassword });
		next();
	}
};
