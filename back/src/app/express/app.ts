import express from "express";
import { loadRoutesExpress } from "./routes/loadUserRoutesExpress";

const app = express();

app.use(express.json());

loadRoutesExpress(app);

export { app };
