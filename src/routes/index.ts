import { Router, Request, Response } from "express";
import cookieParser from "cookie-parser"; // Import cookie-parser
import Polymarket from "../controllers/polymarket.controller";
import {
	generateAuthMiddleware,
	validateAuthMiddleware,
} from "../middleware/validateAuthMiddleware";

const routes = Router();

const polymarket = new Polymarket(); // Create a single instance of Polymarket

routes.get("/", (req: Request, res: Response) => {
	res.status(200).send("Polymarket API Live");
});

// L1 Header
routes.get("/l1-header", (req: Request, res: Response) => {
	polymarket.getL1HeadersController(req, res);
});

// L2 Header
routes.get("/l2-header", async (req: Request, res: Response) => {
	polymarket.getL2HeadersController(req, res);
});

// Create API Keys
routes.post("/create-api-key", async (req: Request, res: Response) => {
	polymarket.createApiKeysController(req, res);
});

// Derive API Key
routes.get("/derive-api-key", async (req: Request, res: Response) => {
	polymarket.deriveApiKeyController(req, res);
});

// Get API Keys
routes.get("/get-api-keys", async (req: Request, res: Response) => {
	polymarket.getApiKeysController(req, res);
});

// Delete API Keys
routes.delete("/delete-api-keys", async (req: Request, res: Response) => {
	polymarket.deleteApiKeysController(req, res);
});

// Get Events
routes.get("/events", async (req: Request, res: Response) => {
	polymarket.getEventsController(req, res);
});

// Get Markets
routes.get("/markets", async (req: Request, res: Response) => {
	polymarket.getMarketsController(req, res);
});

// This route will save credential hash
routes.post(
	"/set-account",
	generateAuthMiddleware,
	async (req: Request, res: Response) => {
		// Display cookies in response
		res.json({
			message: "Cookies saved",
			cookies: req.cookies?.hash,
		});
	}
);

routes.get(
	"/verify-account",
	validateAuthMiddleware,
	async (req: Request, res: Response) => {
		res.json({
			message: "Hashed cookies",
            cookies: req.cookies?.hash,
		});
	}
);

routes.get("/saved-cookies", async (req: Request, res: Response) => {
	const cookies = req.cookies;
	res.json({
		message: "Retrieved cookies",
		cookies: cookies,
	});
});

///////////////////////////////////////////////////////////////////////////////

// SAMPLE POTENTIAL RETURN
routes.get("/sample-potential-return", async (req: Request, res: Response) => {
	polymarket.samplePotentialReturn(req, res);
});

export default routes;
