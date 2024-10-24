import {
	calculateReturns,
	probabilityToAmericanOdds,
	probabilityToDecimalOdds,
} from "../utils/calculations";

// Define types for the market data and potential return data
interface MarketData {
	marketId: number;
	outcomes: string;
	outcomePrices: string;
	// Other properties can be added here
}

interface PotentialReturnData {
	outcomes: string[];
	outcomePrices: number[];
	odds: Array<{
		decimal: number;
		american?: number;
	}>;
	potentialReturns: Array<{
		potentialReturn: number;
		potentialProfit: number;
	}>;
}

// Calculate the returns of the user's portfolio
export const calculateProfit = (
	data: MarketData[],
	betAmount: number = 10
): PotentialReturnData => {
	// Check if data is array
	if (!Array.isArray(data)) {
		throw new Error("Data is not an array");
	}
	// Check if data is empty
	if (data.length === 0) {
		throw new Error("Data is empty");
	}

	// Initialize potential returns
	const potentialReturnData: PotentialReturnData = {
		outcomes: [],
		outcomePrices: [],
		odds: [],
		potentialReturns: [],
	};

	// Loop through the data and parse the outcomes and outcomePrices
	data.forEach((market) => {
		const parsedOutcomePrices = JSON.parse(market.outcomePrices) as number[];
		const parsedOutcomes = JSON.parse(market.outcomes) as string[];

		potentialReturnData.outcomePrices.push(...parsedOutcomePrices);
		potentialReturnData.outcomes.push(...parsedOutcomes);
	});

	// Insert the odds into the potentialReturn object
	potentialReturnData.outcomePrices.forEach((price) => {
		const decimalOdds = probabilityToDecimalOdds(price);
		const americanOdds = probabilityToAmericanOdds(price);
		potentialReturnData.odds.push({
			decimal: decimalOdds,
			american: americanOdds,
		});
	});

	// Calculate returns for each outcome price
	potentialReturnData.odds.forEach((odd) => {
		const returns = calculateReturns(betAmount, odd.decimal);
		potentialReturnData.potentialReturns.push(returns);
	});

	return potentialReturnData;
};
