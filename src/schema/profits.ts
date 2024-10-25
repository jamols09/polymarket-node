// Define types for odds and potential returns
export interface Odds {
	decimal: number;
	american?: number;
}

export interface PotentialReturn {
	potentialReturn: number;
	potentialProfit: number;
}

// Define the PotentialReturnData type using the simplified types
export interface PotentialReturnData {
	outcomes: string[];
	outcomePrices: number[];
	odds: Odds[];
	potentialReturns: PotentialReturn[];
}

export interface MarketData {
	marketId: number;
	outcomes: string;
	outcomePrices: string;
	// Other properties can be added here
}

export interface EventData {
	markets: [];
}

export interface EventMarketData {
	outcomePrices: string;
	outcomes: string;
	question: string;
	slug: string;
	startDate: string;
	endDate: string;
	spread: number;
}

export interface PotentialEventReturnData {
	question: string;
	slug: string;
	outcomes: string[];
	outcomePrices: number[];
	odds: Odds[];
	potentialReturns: PotentialReturn[];
	startDate: string;
	endDate: string;
	spread: number;
}
