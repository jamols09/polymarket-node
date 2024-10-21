import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { createL1Headers, createL2Headers } from "../services/headers";
import { Request, Response } from "express";
import { deriveApiKeys } from "../api/polymarket";
import Cookies from "js-cookie";
import { L1PolyHeader } from "../schema/interfaces";

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
				this.timestamp
			);

			Cookies.set("POLY_ADDRESS", l1Header.POLY_ADDRESS);
			Cookies.set("POLY_SIGNATURE", l1Header.POLY_SIGNATURE);
			Cookies.set("POLY_TIMESTAMP", l1Header.POLY_TIMESTAMP);
			Cookies.set("POLY_NONCE", l1Header.POLY_NONCE);

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
            
			// Get API key credentials from the request
			const apiKeys = await deriveApiKeys({
				POLY_ADDRESS: Cookies.get("POLY_ADDRESS") || "",
				POLY_SIGNATURE: Cookies.get("POLY_SIGNATURE") || "",
				POLY_TIMESTAMP: Cookies.get("POLY_TIMESTAMP") || "",
				POLY_NONCE: Cookies.get("POLY_NONCE") || "",
			});

			const l2Header = await createL2Headers(
				this.wallet,
				{
					key: "358e6058-faf5-7aa1-2f92-ae3b1c0ecdaa",
					secret: "kcJ0zD7nwBZVr1Gykiy0teTfTSoNASOYIfno7hXgpzk=",
					passphrase:
						"52b9a13330a8cee99097f137d0883c16e4592f14d40ee566f4007cae7df7db86",
				},
				{
					method: "get",
					requestPath: "/order",
				}
			);

			res.status(200).json(l2Header);
		} catch (error) {}
	}
}

export default Polymarket;
