import mongoose, { Document } from "mongoose";

export interface ICurrentEventOdds extends Document {
	marketId: string; // Market ID = conditionId
	probability_yes: number;
	probability_no: number;
	slug: string;
}

const schema = new mongoose.Schema(
	{
		marketId: { type: String, required: true }, // Market ID = conditionId
		probability_yes: { type: Number, required: true },
		probability_no: { type: Number, required: true },
		slug: { type: String, required: true },
	},
	{ timestamps: true }
);

export default class CurrentEventOddsModel extends mongoose.model(
	"current_event_odds",
	schema
) {
	public static async saveCurrentEventOdds(
		current_event_odds: any
	): Promise<ICurrentEventOdds | null> {
		// Implement the logic to save current event odds
		try {
			const newCurrentEventOdds = new this(current_event_odds);
			const savedCurrentEventOdds = await newCurrentEventOdds.save();
			return savedCurrentEventOdds;
		} catch (error) {
			console.error("Error saving current event odds:", error);
			return null;
		}
		return null;
	}

	public static async getCurrentEventOdds(): Promise<
		ICurrentEventOdds[] | null
	> {
		try {
			const data = await this.find().sort({ timestamp: -1 }).limit(1);
			return data;
		} catch (error) {
			console.error("Error retrieving current event odds:", error);
			return null;
		}
	}
}
