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
