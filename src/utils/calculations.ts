// Convert the probability (price) to Decimal odds
export const probabilityToDecimalOdds = (price: number): number => {
	return 1 / price;
};

// Convert probability to American odds
export const probabilityToAmericanOdds = (price: number): number => {
	if (price >= 0.5) {
		return -Math.round((price / (1 - price)) * 100);
	} else {
		return Math.round(((1 - price) / price) * 100);
	}
};

// Calculate potential return and profit
export const calculateReturns = (betAmount: number, decimalOdds: number) => {
	const potentialReturn = betAmount * decimalOdds;
	const potentialProfit = potentialReturn - betAmount;
	return { potentialReturn, potentialProfit };
};
