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
	priceHistoryAPI,
} from "../api/polymarket";
import { formatPriceHistory } from "../services/marketPriceHistory"
import {
	ApiCreds,
	ApiKeyCreds,
	ApiKeyRaw,
	L1PolyHeader,
} from "../schema/polymarket";
import {
	calculateEventProfit,
	calculateMarketProfit,
} from "../services/profits";
import { transformEventData } from "../helpers/priceHistoryHelper";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import fs from "fs";

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

	// This method is used to get the events
	public async getEventsController(req: Request, res: Response) {
		try {
			const events = await eventsAPI(req.query);
			const profits = await calculateEventProfit(events);
            console.log(profits);
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
				res.status(500).json({ error: "Cannot get market slug" });
			}
		}
	}

	// Get Market Array Prices. This call will come from a cron job in laravel
	public async getMarketListController(req: Request, res: Response) {
		try {
			const marketSlugs = req.body?.markets;

			if (marketSlugs === undefined) {
				return res.status(500).json({ error: "No slugs found" });
			}

			// Initialize array loops
			let markets = [];
			let profits = [];

			// Get the market results and do api calls
			for (const slug of marketSlugs) {
				markets.push(await marketsAPI(slug));
			}
			// Get the profit results
			for (const market of markets) {
				profits.push(calculateMarketProfit(market));
			}

			return res.status(200).json({ profits });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(500).json({ error: "Cannot get market slug" });
			}
		}
	}

	// This method is used to get the price history
	public async getPriceHistoryController(
		req: Request,
		res: Response
	): Promise<void> {
		const { eventId } = req.params;

		try {
			const [event] = await eventsAPI({ id: eventId });

			if (!event.markets || event.markets.length === 0) {
				res
					.status(404)
					.json({ error: `No markets found for event ${eventId}` });
				return;
			}

			for (const market of event.markets) {
				try {
					const clobTokenIds = validateMarket(market);
					const startTs = convertDateToUnix(new Date(market.startDateIso));
					const endTs = convertDateToUnix(new Date(market.endDateIso));

					// Fetch and assign price history data
					market.priceHistory = await getMarketPriceHistory(
						clobTokenIds,
						startTs,
						endTs
					);
				} catch (error) {
					res.status(404).json({ error: error });
					return;
				}
			}

			// Construct response using the Event and Market interfaces

			const eventData = transformEventData(event);
	public async getPriceHistoryController(req: Request, res: Response): Promise<void> {
    const { eventSlug } = req.params;

    try {
        const events = await eventsAPI({
					actice: true, 
					order: 'slug', 
					ascending: false, 
					... (eventSlug ? { slug: eventSlug } : {})
				});

        const eventData = await Promise.all(events.map(async(event: any) => {
					return await formatPriceHistory(event);
        }));

        // Send the typed response
        res.status(200).json(eventData);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: "Failed to get market or price history" });
    }
	}

	public async setAccount(req: Request, res: Response) {
		// Get password from the request
		const password = req.headers["credentials"] as string;

		// Throw error when there is no password included
		if (!password) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				error: StatusCodes.UNAUTHORIZED,
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
				sameSite: "none",
			});

			// Store the cookie to passwords.json
			const storePassword = async (hashedPassword: any) => {
				fs.writeFileSync(
					"passwords.json",
					JSON.stringify({ password: hashedPassword })
				);
			};
			storePassword(hashedPassword);

			const data = fs.readFileSync("passwords.json", "utf8");
			const json = JSON.parse(data);
			const filePassword = json.password;

			// Debugging
			console.table({
				password,
				cookies: req.cookies.hash,
				hashedPassword,
				filePassword,
			});
		}

		// Display cookies in response
		res.json({
			message: "Cookies saved",
			cookies: req.cookies,
		});
	}
}

export default Polymarket;
