import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { OpenAI } from "openai";

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

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const client = new OpenAI({
	apiKey,
	baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

app.post(
	"/api/explain-code",
	async (req: express.Request, res: express.Response) => {
		try {
			const { code, language } = req.body;

			if (!code) {
				res.status(400).json({ error: "Code is required" });
			}
			console.log("code from user is fetched parsed successfully");

			const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
				{
					role: "user",
					content: `please explain this ${
						language ?? "JavaScript"
					} code in simple terms:\n\n
				\`\`\`${language}\n${code}\`\`\`
				`,
				},
			];

			console.log("calling the gemini endpoint");

			const response = await client.chat.completions.create({
				model: "gemini-2.0-flash",
				messages,
			});

			console.log("getting response from gemini");
			console.log("response :: ", response);
			const explanation = response.choices[0]?.message;

			if (!explanation) {
				res.status(500).json({ error: "Failed to generate explanation" });
			}

			res.status(200).json({ explanation, language: language || "Unknown" });
		} catch (error) {
			if (error instanceof Error) {
				console.error(`${req.url}Errored while parsing request body:`, error);
				res
					.status(500)
					.json({ error: "Something went wrong", details: error.message });
			}

			res.status(500).json({ error: "Something went wrong" });
		}
	}
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Listening on port http://localhost:${port}`);
});
