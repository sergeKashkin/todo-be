import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import * as rfs from "rotating-file-stream";
import { DEFAULT_PORT } from './constants';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/error';
import cors from "cors";
import { authHandler } from './middleware/auth';

dotenv.config();
connectDB();

const app: Express = express();
const port: number = Number(process.env.PORT) || DEFAULT_PORT;

const logStream: rfs.RotatingFileStream = rfs.createStream("log.log", {
    interval: "1d",
    path: path.join(__dirname, "/../log")
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan("combined", {stream: logStream}));
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({message: "Hello world"});
});

app.use("/api/todo", require("./routes/todo"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});