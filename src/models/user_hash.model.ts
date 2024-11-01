import mongoose, { Document } from "mongoose";

export interface IUserHash extends Document {
	credentials: string; // Credentials
}

const schema = new mongoose.Schema(
	{
		credentials: { type: String, required: true }, // Crendentials
	},
	{ timestamps: true }
);

export default class UserHashModel extends mongoose.model(
	"user_hash",
	schema
) {
	public static async saveUserHash(user_hash: any): Promise<IUserHash | null> {
		// Implement the logic to save current event odds
		try {
			const hash = new this(user_hash);
			const savedHash = await hash.save();
			return savedHash;
		} catch (error) {
			console.error("Error saving current event odds:", error);
			return null;
		}
		return null;
	}
}
