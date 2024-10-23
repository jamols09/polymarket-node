import { Router, Request, Response } from "express";
import Polymarket from "../controllers/polymarket";

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

export default routes;
