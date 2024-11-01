import "dotenv/config";
import routes from "./routes";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cron from "node-cron";
import { dbconnect } from "./services/mongodb/mongodb.service";
// Websocket
import expressWs from "express-ws";

// Import the cron job
import { generateCronJob } from "./services/cronjob/polymarket.cronjob";
import { setupWebsocket } from "./websocket/polymarket.websocket";

// Initialize Port
const PORT = process.env.PORT || 5008;
// Initialize express
const server = express();

dbconnect();

// Initialize the websocket
expressWs(server);

server.use(morgan("dev"));
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Initialize the routes
server.use("", routes);

// Start the server
server.listen(PORT, () => {
	console.log(`PORT --> ${PORT}`);
});


/*
 * This cron job will run every 10 minutes
 * This is where you will put the code to generate the target reports
 */
cron.schedule("*/10 * * * *", generateCronJob);
/*
 * Websocket setup
 */
setupWebsocket(server);

export default server;