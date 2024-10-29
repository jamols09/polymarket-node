import {
	probabilityToDecimalOdds,
	probabilityToAmericanOdds,
	calculateReturns,
} from "../utils/calculations";
import {
	MarketData,
	PotentialReturnData,
	EventData,
	EventMarketData,
	PotentialEventReturnData,
	Odds,
	PotentialReturn,
} from "../schema/profits";

// Utility function to check if data is a non-empty array
const validateArrayData = (data: any): void => {
	if (!Array.isArray(data)) {
		throw new Error("Data is not an array");
	}
	if (data.length === 0) {
		throw new Error("Data is empty");
	}
};

// Calculate the returns of the user's portfolio
export const calculateMarketProfit = (
	data: MarketData[],
	betAmount: number = 10
): PotentialReturnData => {
	validateArrayData(data);

	// Initialize potential returns
	const potentialReturnData: PotentialReturnData = {
		question: "",
		slug: "",
        startDate: "",
        endDate: "",
		outcomes: [],
		outcomePrices: [],
		odds: [],
		potentialReturns: [],
        icon: "",
	};

	// Loop through the data and parse the outcomes and outcomePrices
	data.forEach((market) => {
		const parsedOutcomePrices = JSON.parse(market.outcomePrices) as number[];
		const parsedOutcomes = JSON.parse(market.outcomes) as string[];

		potentialReturnData.outcomePrices.push(...parsedOutcomePrices);
		potentialReturnData.outcomes.push(...parsedOutcomes);

		potentialReturnData.question = market.question;
		potentialReturnData.slug = market.slug;
        potentialReturnData.startDate = market.startDate;
        potentialReturnData.endDate = market.endDate;
        potentialReturnData.icon = market.icon;
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

// Calculate event profit
export const calculateEventProfit = (
	data: EventData[],
	betAmount: number = 10
): PotentialEventReturnData[] => {
	// Validate the data
	validateArrayData(data);

	// Initialize potential event returns
	const potentialEventReturns: PotentialEventReturnData[] = [];

	// Loop through the data
	data.forEach((event) => {
		event.markets.forEach((market: EventMarketData) => {
			const parsedOutcomePrices = JSON.parse(market.outcomePrices) as number[];
			const parsedOutcomes = JSON.parse(market.outcomes) as string[];

			const odds: Odds[] = parsedOutcomePrices.map((price) => ({
				decimal: probabilityToDecimalOdds(price),
				american: probabilityToAmericanOdds(price),
			}));

			const potentialReturns: PotentialReturn[] = odds.map((odd) =>
				calculateReturns(betAmount, odd.decimal)
			);

			const potentialEventReturn: PotentialEventReturnData = {
				question: market.question,
				slug: market.slug,
				outcomes: parsedOutcomes,
				outcomePrices: parsedOutcomePrices,
				odds,
				potentialReturns,
				startDate: market.startDate,
				endDate: market.endDate,
				spread: market.spread,
                icon: market.icon,
			};

			potentialEventReturns.push(potentialEventReturn);
		});
	});

	return potentialEventReturns;
};
