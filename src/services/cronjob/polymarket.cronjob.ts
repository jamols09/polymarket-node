import { eventsAPI, marketsAPI } from "../../api/polymarket";
import { calculateMarketProfit } from "../profits";
import CurrentEventOddsModel from "../../models/current_event_odds.model";

/**
 * Generate a cronjob to save the data
 * This will only accept market slugs for now
 * 
 * @param url Market Slug
 */
export const generateCronJob = async (url: any) => {
    console.log("Cronjob Data saved");
	const staticUrl = [
		"?slug=will-manchester-city-win-the-uefa-champions-league",
		"?slug=will-real-madrid-win-the-uefa-champions-league",
        "?slug=will-arsenal-win-the-uefa-champions-league",
        "?slug=will-liverpool-win-the-uefa-champions-league",
        "?slug=will-bayern-munich-win-the-uefa-champions-league",
        "?slug=will-inter-milan-win-the-uefa-champions-league",
        "?slug=will-bayer-leverkusen-win-the-uefa-champions-league"
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
