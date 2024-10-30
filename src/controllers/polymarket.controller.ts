import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { createL1Headers, createL2Headers } from "../services/headers";
import { Request, Response } from "express";
import {
	deriveApiKeys,
	authAPI,
	samplePotentialReturn,
	eventsAPI,
	marketsAPI,
} from "../api/polymarket";

import {
	ApiCreds,
	ApiKeyCreds,
	ApiKeyRaw,
	L1PolyHeader,
} from "../schema/polymarket";
import { calculateEventProfit, calculateMarketProfit } from "../services/profits";

class Polymarket {
	private provider: JsonRpcProvider;
	private wallet: Wallet;
	private chainId: number;
	private timestamp: number;
	private nonce: number;

	constructor() {
		// if no private key is set this will throw an error
		const privateKey = process.env.PRIVATE_KEY;
        
		if (!privateKey) {
			throw new Error("PRIVATE_KEY is not defined");
		}

		this.provider = new JsonRpcProvider("https://polygon-rpc.com/");
		this.wallet = new Wallet(privateKey, this.provider);
		this.chainId = 137;
		this.timestamp = Math.floor(Date.now() / 1000);
		this.nonce = 23;
	}

	// This method is used to get the L1 headers
	public async getL1HeadersController(req: Request, res: Response) {
		try {
			const l1Header: L1PolyHeader = await createL1Headers(
				this.wallet,
				this.chainId,
				this.nonce,
				(this.timestamp = Math.floor(Date.now() / 1000))
			);

			res.status(200).json(l1Header);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "An unknown error occurred" });
			}
		}
	}

	// This method is used to get the L2 headers
	public async getL2HeadersController(req: Request, res: Response) {
		try {
			// We form the apiKeys object
			const apiKeys: ApiKeyCreds = {
				key: req.cookies.POLY_API_KEY,
				secret: req.cookies.POLY_SECRET,
				passphrase: req.cookies.POLY_PASSPHRASE,
			};

			const l2Header = await createL2Headers(this.wallet, apiKeys, {
				method: "get",
				requestPath: "/order",
			});

			res.status(200).json(l2Header);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "An unknown error occurred" });
			}
		}
	}

	// This method will create API key
	public async createApiKeysController(req: Request, res: Response) {
		try {
			const headerArgs = {
				method: "POST",
				requestPath: "/auth/api-key",
			};

			const l1Header = await createL1Headers(
				this.wallet,
				this.chainId,
				this.nonce,
				Math.floor(Date.now() / 1000)
			);

			const apiResponse = await authAPI(l1Header, headerArgs);

			// We save the key, secret and passphrase in the cookies
			res.cookie("POLY_API_KEY", apiResponse.apiKey);
			res.cookie("POLY_SECRET", apiResponse.secret);
			res.cookie("POLY_PASSPHRASE", apiResponse.passphrase);
			res.cookie("POLY_NONCE", this.nonce.toString());

			res.status(200).json(apiResponse);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Cannot derive API Keys" });
			}
		}
	}

	// This method is used to get existing api key for an address and nonce
	public async deriveApiKeyController(req: Request, res: Response) {
		try {
			// Get API key credentials from the request cookies
			const l1Header: L1PolyHeader = await createL1Headers(
				this.wallet,
				this.chainId,
				this.nonce,
				(this.timestamp = Math.floor(Date.now() / 1000))
			);

			const apiResponse: ApiKeyRaw = await deriveApiKeys(l1Header);

			// We save the key, secret and passphrase in the cookies
			res.cookie("POLY_API_KEY", apiResponse.apiKey);
			res.cookie("POLY_SECRET", apiResponse.secret);
			res.cookie("POLY_PASSPHRASE", apiResponse.passphrase);
			res.cookie("POLY_NONCE", this.nonce.toString());

			res.status(200).json(apiResponse);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Cannot derive API Keys" });
			}
		}
	}

	// This method is used to get the API keys associated with a Polygon address.
	public async getApiKeysController(req: Request, res: Response) {
		try {
			const headerArgs = {
				method: "GET",
				requestPath: "/auth/api-keys",
			};

			// We form the api keys object
			const apiKeys: ApiCreds = {
				key: req.cookies.POLY_API_KEY,
				secret: req.cookies.POLY_SECRET,
				passphrase: req.cookies.POLY_PASSPHRASE,
			};
			// We get the headers
			const l2Header = await createL2Headers(
				this.wallet,
				apiKeys,
				headerArgs,
				(this.timestamp = Math.floor(Date.now() / 1000))
			);

			// We get the API keys
			const retrievedApiKeys = await authAPI(l2Header, headerArgs);

			res.status(200).json(retrievedApiKeys);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Cannot derive API Keys" });
			}
		}
	}

	// This method is used to get the API keys associated with a Polygon address.
	public async deleteApiKeysController(req: Request, res: Response) {
		try {
			const headerArgs = {
				method: "DELETE",
				requestPath: "/auth/api-key",
			};

			// We form the apiKeys object
			const apiKeys: ApiCreds = {
				key: req.cookies.POLY_API_KEY,
				secret: req.cookies.POLY_SECRET,
				passphrase: req.cookies.POLY_PASSPHRASE,
			};
			// We get the headers
			const l2Header = await createL2Headers(
				this.wallet,
				apiKeys,
				headerArgs,
				(this.timestamp = Math.floor(Date.now() / 1000))
			);

			// We get the API keys
			const retrievedApiKeys = await authAPI(l2Header, headerArgs);

			res.status(200).json(retrievedApiKeys);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Cannot derive API Keys" });
			}
		}
	}

	////////////////////////////////////////////////////////// THIS IS A SAMPLE METHOD
	public async samplePotentialReturn(req: Request, res: Response) {
		try {
			const response = await samplePotentialReturn(
				`https://clob.polymarket.com/markets/0x12a0cb60174abc437bf1178367c72d11f069e1a3add20b148fb0ab4279b772b2`
			);

			res.status(200).json(response);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Cannot derive API Keys" });
			}
		}
	}
	///////////////////////////////////////////////////////// THIS IS A SAMPLE METHOD

	// This method is used to get the events
	public async getEventsController(req: Request, res: Response) {
		try {
			const events = await eventsAPI(req.query);
			const profits = await calculateEventProfit(events);
			res.status(200).json(profits);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Cannot get events" });
			}
		}
	}

	// This method is used to get the markets or single market
	public async getMarketsController(req: Request, res: Response) {
		try {
			const markets = await marketsAPI(req.query);
			const profits = calculateMarketProfit(markets);
			res.status(200).json(profits);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Cannot get markets" });
			}
		}
	}
}

export default Polymarket;
