import axios from "axios";

interface Config {
	POLY_ADDRESS: string;
	POLY_SIGNATURE: string;
	POLY_TIMESTAMP: string;
	POLY_NONCE: string;
}

interface ApiResponse {
	// Define the expected structure of the response if known
}

export const deriveApiKeys = async (config: Config): Promise<ApiResponse> => {
	try {
		
		const result = await axios.get<ApiResponse>(
			"https://clob.polymarket.com/auth/derive-api-key",
			{
				headers: {
					POLY_ADDRESS: config.POLY_ADDRESS,
					POLY_SIGNATURE: config.POLY_SIGNATURE,
					POLY_TIMESTAMP: config.POLY_TIMESTAMP,
					POLY_NONCE: config.POLY_NONCE,
				},
				timeout: 5000, // Set a timeout of 5 seconds
			}
		);

		return result.data;
	} catch (error) {
		console.error(error);
		throw new Error("Failed to fetch L2 headers");
	}
};
