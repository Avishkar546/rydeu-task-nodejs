import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.get("/", (req, res) => {
    res.send("Server testing");
});

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));
app.use(express.json({
    limit: '16kb'
}));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import pricingRouter from './routes/pricing.routes.js';
import { Pricing } from './models/price.models.js';
app.use("/api/v1/price", pricingRouter);

export { app };
