import mongoose, { Document } from "mongoose";

export interface IHistoricalEventData extends Document {
	marketId: string;
	probality_yes: number;
	probality_no: number;
    question: string;
}

const schema = new mongoose.Schema(
	{
		marketId: { type: String, required: true },
		probability_yes: { type: Number, required: true },
		probability_no: { type: Number, required: true },
		question: { type: String, required: true },
	},
	{ timestamps: true }
);

export default class HistoricalEventDataModel extends mongoose.model('current_event_odds', schema) {
	public static async saveHistoricalEventData(current_event_odds: string): Promise<IHistoricalEventData | null> {
		// Implement the logic to save current event odds
		// For now, return null or a mock IHistoricalEventData object
		return null;
	}
  }
