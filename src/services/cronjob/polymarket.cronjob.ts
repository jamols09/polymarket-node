import { eventsAPI, marketsAPI } from "../../api/polymarket";
import { calculateMarketProfit } from "../profits";
import CurrentEventOddsModel from "../../models/current_event_odds.model";

export const geneRateCronJob = async (url: any) => {
    console.log("Cron Job Running");
	const staticUrl = [
		"?slug=will-kamala-harris-win-the-2024-us-presidential-election",
		"?slug=will-donald-trump-win-the-2024-us-presidential-election",
	];

	// API CALL
	let events: any[] = [];
	for (const url of staticUrl) {
		const event = await marketsAPI(url);
		events.push(event);
	}

	let results: any[] = [];
	// Calculate the potential returns assuming we set the bet to $10 which is not relevant to the data
	for (const event of events) {
		const result = calculateMarketProfit(event);
		results.push(result);
	}

	// Save the data
	for (const result of results) {
		const data = {
			slug: result.slug,
			marketId: result.conditionId,
			probability_yes: result.odds[0].american,
			probability_no: result.odds[1].american,
		};

		await CurrentEventOddsModel.saveCurrentEventOdds(data);
	}
};
