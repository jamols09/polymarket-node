import { Router, Request, Response } from "express";
import Polymarket from "../controllers/polymarket.controller";
import { validateAuthMiddleware } from "../middleware/validateAuth.middleware";
import fs from "fs";

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

// Get Price History
routes.get("/price-history/:eventId", async (req: Request, res: Response) => {
	polymarket.getPriceHistoryController(req, res);
});

// Get Events
routes.get(
	"/events/:eventId?",
	validateAuthMiddleware,
	async (req: Request, res: Response) => {
		polymarket.getEventsController(req, res);
	}
);

// Get Markets
routes.get(
	"/markets/:marketId?",
	validateAuthMiddleware,
	async (req: Request, res: Response) => {
		polymarket.getMarketsController(req, res);
	}
);

// Get Market Array Prices. This call will come from a cron job in laravel
routes.post("/market-list", async (req: Request, res: Response) => {
	polymarket.getMarketListController(req, res);
});

// This route will save credential hash
routes.post("/set-account", async (req: Request, res: Response) => {
	polymarket.setAccount(req, res);
});

// This route will verify the account
routes.get(
	"/verify-account",
	validateAuthMiddleware,
	async (req: Request, res: Response) => {
		res.json({
			message: "Account verified",
		});
	}
);

// Debugging purpose for showing saved cookies only
routes.get("/saved-cookies", async (req: Request, res: Response) => {
	const cookies = req.cookies;
	let filePassword;
	if (!cookies) {
		const data = fs.readFileSync("passwords.json", "utf8");
		const json = JSON.parse(data);
		filePassword = json.password;
	}
	res.json({
		message: "Retrieved cookies",
		cookies: cookies ?? filePassword,
	});
});

export default routes;
