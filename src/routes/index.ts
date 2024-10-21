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

export default routes;
