import "dotenv/config";
import routes from "./routes";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cron from "node-cron";
import { dbconnect } from "./services/mongodb/mongodb.service";

// Initialize Port
const PORT = process.env.PORT || 5002;
// Initialize express
const server = express();

dbconnect();

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

const geneRateCronJob = () => {
	console.log("Generating target reports");
	console.log("HELLO WORLD");
};

// Run cronjob every 1 minute
cron.schedule("* * * * *", geneRateCronJob);

export default server;
