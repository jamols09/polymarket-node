import "dotenv/config";
import express from "express";
import morgan from "morgan"; // used for logging
import cors from "cors"; // used for cross-origin requests
import { notFoundMiddleware } from "./middleware";
import routes from "./routes";
import 'dotenv/config';
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5008;
const server = express();

server.use(cookieParser()); // parse cookies
server.use(morgan("dev")); // log requests to the console
server.use(cors()); // enable cross-origin requests
server.use(express.json()); // parse requests of content-type - application/json
server.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

server.use(routes); // add the routes to the server with prefix "/api"

server.use(notFoundMiddleware); // handle 404 errors with custom middleware or

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`); // log the server URL to the console
});

export default server;
