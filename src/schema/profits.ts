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
    question: string;
    slug: string;
    startDate: string;
    endDate: string;
    icon?: string;
}

export interface MarketData {
    startDate: string;
    endDate: string;
    question: string;
    slug: string;
	marketId: number;
	outcomes: string;
	outcomePrices: string;
    icon?: string;
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
    icon?: string;
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
    icon?: string;
}
