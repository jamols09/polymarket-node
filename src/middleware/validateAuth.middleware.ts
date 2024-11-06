import { NextFunction, Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes"; // used for HTTP status codes
import bcrypt from "bcrypt";
import fs from "fs";

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

	// Check if password is stored in file
	const data = fs.readFileSync("passwords.json", "utf8");
	const json = JSON.parse(data);
	const filePassword = json?.password;

	// Check if password is stored in cookies
	if (!req.cookies.hash && !filePassword) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: "Empty password",
			message: "No password is found in cookies or system",
		});
		return;
	}

	let isMatch = false;
	// Check if password is stored in cookies
	if (req.cookies.hash !== undefined) {
		isMatch = await bcrypt.compare(password, req.cookies.hash);
		console.log("isMatch", isMatch);
	}
	// Check if password is stored in file
	if (!isMatch && filePassword) {
		isMatch = await bcrypt.compare(password, filePassword);
		console.log("isMatch", { isMatch, filePassword });
	}

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
