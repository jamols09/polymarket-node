import { eventsAPI, marketsAPI } from "../../api/polymarket";
import { calculateMarketProfit } from "../profits";
import CurrentEventOddsModel from "../../models/current_event_odds.model";

export const geneRateCronJob = async () => {
	const url = "?slug=will-kamala-harris-win-the-2024-us-presidential-election";

	// API CALL
	const events = await marketsAPI(url);

	// Calculate the potential returns assuming we set the bet to $10 which is not relevant to the data
	const result = calculateMarketProfit(events);

    // Log the data
    const data = {
        slug: result.slug,
        marketId: result.conditionId,
        probability_yes: result.odds[0].american,
        probability_no: result.odds[1].american,
    }
	
    await CurrentEventOddsModel.saveCurrentEventOdds(data);
};
