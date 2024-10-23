import axios, { AxiosResponse } from "axios";
import {
	ApiKeyRaw,
	L2PolyHeader,
	L1PolyHeader,
	PolymarketAPIResponse,
} from "../schema/interfaces";

axios.defaults.withCredentials = true;

// This function is used to derive the API keys
export const deriveApiKeys = async (
	config: L1PolyHeader
): Promise<ApiKeyRaw> => {
	try {
		const result = await axios.get<ApiKeyRaw>(
			"https://clob.polymarket.com/auth/derive-api-key",
			{
				headers: config,
				timeout: 5000, // Set a timeout of 5 seconds
			}
		);

		return {
			apiKey: result.data.apiKey,
			secret: result.data.secret,
			passphrase: result.data.passphrase,
		};
	} catch (error: any) {
		console.error("Error making request:", error.message);
        throw new Error("Failed to make request");
	}
};

// This function is used to get the API keys or delete API keys
export const authAPI = async (
	config: L2PolyHeader | L1PolyHeader,
	headerArgs: any
): Promise<any> => {
	try {
		const url = `https://clob.polymarket.com${headerArgs.requestPath}`;
		const options = { headers: config };
		let result: AxiosResponse<any>;

		switch (headerArgs.method) {
			case "GET":
				result = await axios.get<any>(url, options);
				break;
			case "POST":
				result = await axios.post<PolymarketAPIResponse>(url, {}, options);
				break;
			case "DELETE":
				result = await axios.delete<any>(url, options);
				break;
			default:
				throw new Error(`Unsupported method: ${headerArgs.method}`);
		}

		return result.data;
	} catch (error: any) {
		console.error("Error making request:", error.message);
		throw new Error("Failed to make request");
	}
};