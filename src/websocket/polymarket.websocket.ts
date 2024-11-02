import { Application, Request } from "express";
import CurrentEventOddsModel from "../models/current_event_odds.model";

declare module "express-serve-static-core" {
	interface Application {
		ws: (route: string, callback: (ws: any, req: Request) => void) => void;
	}
}

export const setupWebsocket = (app: Application) => {
    console.log("Websocket Initialized");
	// Define WebSocket endpoint
	app.ws("/data-stream", async (ws, req: Request) => {
		console.log("Client connected to /data-stream WebSocket");

		const sendDataToClient = async () => {
			try {
				// Fetch data when a client connects or sends a message
				const data = await CurrentEventOddsModel.getCurrentEventOdds();
				if (data) {
					ws.send(JSON.stringify(data));
				} else {
					ws.send(JSON.stringify({ error: "No data available" }));
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				ws.send(JSON.stringify({ error: "Error retrieving data" }));
			}
		};

		// Listen for client messages
		ws.on("message", async (msg: string) => {
			console.log("Received message from client:", msg);
			try {
				const data = await CurrentEventOddsModel.getCurrentEventOdds();
				ws.send(JSON.stringify(data));
			} catch (error) {
				console.error("Error fetching data:", error);
				ws.send(JSON.stringify({ error: "Error retrieving data" }));
			}
		});

		sendDataToClient();
		const intervalId = setInterval(sendDataToClient, 5000);

		// Handle client disconnection
		ws.on("close", () => {
			console.log("Client disconnected");
			clearInterval(intervalId);
		});
	});
};
