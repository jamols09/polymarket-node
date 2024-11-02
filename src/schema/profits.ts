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
		id: number;
    question: string;
    slug: string;
    startDate: string;
    endDate: string;
    betAmount: number;
    conditionId: string;
    icon?: string;
}

export interface MarketData {
		id: number,
    startDate: string;
    endDate: string;
    question: string;
    slug: string;
	marketId: number;
	outcomes: string;
	outcomePrices: string;
    conditionId: string;
    icon?: string;
	// Other properties can be added here
}

export interface EventData {
	markets: [];
}

export interface EventMarketData {
	id: number,
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
	id: number;
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
