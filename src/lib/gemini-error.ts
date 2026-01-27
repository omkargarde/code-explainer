export interface GeminiApiError {
  error: {
    code: number;
    message: string;
    status: string;
    details: Array<{
      "@type": string;
      description?: string;
      url?: string;
      quotaMetric?: string;
      quotaId?: string;
      quotaDimensions?: {
        location?: string;
        model?: string;
      };
      quotaValue?: string;
      retryDelay?: string;
    }>;
  };
}

export interface ParsedGeminiError {
  code: number;
  message: string;
  status: string;
  isRateLimitError: boolean;
  retryAfterSeconds?: number;
  quotaMetric?: string;
  model?: string;
  quotaLimit?: number;
}

export function parseGeminiError(error: GeminiApiError): ParsedGeminiError {
  const { code, message, status, details } = error.error;

  const retryDetail = details.find(
    (d) => d["@type"] === "type.googleapis.com/google.rpc.RetryInfo",
  );
  const quotaDetail = details.find(
    (d) => d["@type"] === "type.googleapis.com/google.rpc.QuotaFailure",
  );

  let retryAfterSeconds: number | undefined;
  if (retryDetail?.retryDelay) {
    const match = retryDetail.retryDelay.match(/(\d+)s/);
    if (match) {
      retryAfterSeconds = Number.parseInt(match[1], 10);
    }
  }

  const quotaLimit = quotaDetail?.quotaValue
    ? Number.parseInt(quotaDetail.quotaValue, 10)
    : undefined;

  return {
    code,
    message,
    status,
    isRateLimitError: code === 429,
    retryAfterSeconds,
    quotaMetric: quotaDetail?.quotaMetric,
    model: quotaDetail?.quotaDimensions?.model,
    quotaLimit,
  };
}

export function handleGeminiError(err: unknown): Response | null {
  if (err && typeof err === "object" && "message" in err) {
    const errorMessage = err.message as string;
    try {
      const errorData = JSON.parse(errorMessage) as GeminiApiError;
      const parsedError = parseGeminiError(errorData);

      if (parsedError.isRateLimitError) {
        return new Response(
          JSON.stringify({
            code: 429,
            message: parsedError.message,
            retryAfter: parsedError.retryAfterSeconds,
            quotaLimit: parsedError.quotaLimit,
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } catch {
      console.log("Failed to parse gemini api error");
    }

    return new Response(JSON.stringify({ code: 500, message: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}
