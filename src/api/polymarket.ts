import axios, { AxiosResponse } from "axios";
import {
	ApiKeyRaw,
	L2PolyHeader,
	L1PolyHeader,
	PolymarketAPIResponse,
} from "../schema/polymarket";
import {
	calculateReturns,
	probabilityToAmericanOdds,
	probabilityToDecimalOdds,
} from "../utils/calculations";

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

// This function is used to get the list of markets in the events
export const eventsAPI = async (query: any) => {
	try {
        
		const params = new URLSearchParams(query as Record<string, string>);
		const url = `https://gamma-api.polymarket.com/events?${params.toString()}`;
		const result: AxiosResponse<any> = await axios.get<any>(url);
       
		return result.data;
	} catch (error: any) {
		console.error("Error making request:", error.message);
		throw new Error("Failed to make request");
	}
};

// This function is used to get the list of markets
export const marketsAPI = async (query: any) => {
	try {
		const params = new URLSearchParams(query as Record<string, string>);
		const url = `https://gamma-api.polymarket.com/markets?${params.toString()}`;
		const result: AxiosResponse<any> = await axios.get<any>(url);

		return result.data;
	} catch (error: any) {
		console.error("Error making request:", error.message);
		throw new Error("Failed to make request");
	}
};

///////////////////////////////////////////////////////////////////////////////
interface Token {
	outcome: string;
	price: number;
	winner: boolean;
}

interface MarketResponse {
	tokens: Token[];
}

export const samplePotentialReturn = async (url: string) => {
	try {
		const response = await axios.get<MarketResponse>(
			"https://clob.polymarket.com/markets/0x26ee82bee2493a302d21283cb578f7e2fff2dd15743854f53034d12420863b55"
		);

		console.log(response.data);

		// Extract the 'Yes' outcome's price
		const yesToken = response.data.tokens.find(
			(token) => token.outcome === "Republican"
		);

		if (!yesToken) {
			throw new Error('No "Yes" outcome found in the market data.');
		}

		const price = yesToken.price;
		console.log(`Price (Probability): ${price}`);

		// Convert to Decimal and American odds
		const decimalOdds = probabilityToDecimalOdds(price);
		const americanOdds = probabilityToAmericanOdds(price);

		console.log(`Decimal Odds: ${decimalOdds}`);
		console.log(
			`American Odds: ${americanOdds > 0 ? `+${americanOdds}` : americanOdds}`
		);

		// Calculate returns for a $10 bet
		const betAmount = 10;
		const { potentialReturn, potentialProfit } = calculateReturns(
			betAmount,
			decimalOdds
		);

		console.log(`Potential Profit: $${potentialProfit.toFixed(2)}`);
		console.log(`Total Return: $${potentialReturn.toFixed(2)}`);
	} catch (error) {
		console.error("Error fetching market data:", error);
	}
};
