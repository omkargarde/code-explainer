import { useEffect, useRef, useState } from "react";

interface RateLimitInfo {
  retryAfter: number;
  quotaLimit?: number;
  message: string;
  timestamp: number;
}

interface UseRateLimitCountdownReturn {
  remainingSeconds: number | null;
  rateLimitInfo: RateLimitInfo | null;
  isRateLimited: boolean;
  clearRateLimit: () => void;
}

export function useRateLimitCountdown(
  rateLimitKey: string,
): UseRateLimitCountdownReturn {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(
    null,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearRateLimit = () => {
    localStorage.removeItem(rateLimitKey);
    setRemainingSeconds(null);
    setRateLimitInfo(null);
  };

  const getRateLimitInfo = (): RateLimitInfo | null => {
    try {
      const stored = localStorage.getItem(rateLimitKey);
      if (!stored) return null;
      return JSON.parse(stored) as RateLimitInfo;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const info = getRateLimitInfo();
    if (info) {
      const elapsed = (Date.now() - info.timestamp) / 1000;
      const remaining = info.retryAfter - elapsed;

      if (remaining > 0) {
        setRateLimitInfo(info);
        setRemainingSeconds(Math.ceil(remaining));

        intervalRef.current = setInterval(() => {
          const newElapsed = (Date.now() - info.timestamp) / 1000;
          const newRemaining = info.retryAfter - newElapsed;
          if (newRemaining <= 0) {
            clearRateLimit();
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          } else {
            setRemainingSeconds(Math.ceil(newRemaining));
          }
        }, 1000);
      } else {
        clearRateLimit();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    remainingSeconds,
    rateLimitInfo,
    isRateLimited: remainingSeconds !== null,
    clearRateLimit,
  };
}
