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
	// Validate the data
	validateArrayData(data);

	// Initialize potential returns
	const potentialReturnData: PotentialReturnData = {
		id: 0,
		question: "",
		slug: "",
		startDate: "",
		endDate: "",
		outcomes: [],
		outcomePrices: [],
		odds: [],
		potentialReturns: [],
		icon: "",
		betAmount: 0,
		conditionId: "",
	};

	// Loop through the data and parse the outcomes and outcomePrices
	data.forEach((market) => {
		const parsedOutcomePrices = JSON.parse(market.outcomePrices) as number[];
		const parsedOutcomes = JSON.parse(market.outcomes) as string[];

		potentialReturnData.outcomePrices.push(...parsedOutcomePrices);
		potentialReturnData.outcomes.push(...parsedOutcomes);

		potentialReturnData.id = market.id;
		potentialReturnData.question = market.question;
		potentialReturnData.slug = market.slug;
		potentialReturnData.startDate = market.startDate;
		potentialReturnData.endDate = market.endDate;
		potentialReturnData.icon = market.icon;
		potentialReturnData.conditionId = market.conditionId;
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

	// Set the bet amount
	potentialReturnData.betAmount = betAmount;

	// Calculate returns for each outcome price
	potentialReturnData.odds.forEach((odd) => {
		const returns = calculateReturns(betAmount, odd.decimal);
		potentialReturnData.potentialReturns.push(returns);
	});

	return potentialReturnData;
};

// Calculate event profit
export const calculateEventProfit = (
	data: any[],
	betAmount: number = 10
): any => {
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
				id: market.id,
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

	let marketProfits = {
		slug: data[0].slug,
		title: data[0].title,
		description: data[0].description,
		image: data[0].image,
		markets: potentialEventReturns,
	};

	return marketProfits;
};
