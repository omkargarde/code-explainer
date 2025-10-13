import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(
	cors({
		origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
		credentials: true,
	})
);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100,
	message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(express.json({ limit: "10mb" }));

app.post(
	"/api/explain-code",
	(req: Express.Request, res: Express.Response) => {
    
  }
);
