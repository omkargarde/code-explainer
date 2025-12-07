import { createMiddleware } from "@tanstack/react-start";
import * as Sentry from "@sentry/react";

export const requestLogger = createMiddleware().server(
  async ({ request, next }) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${request.method} ${request.url} - Starting`);

    try {
      const response = await next();
      const duration = Date.now() - startTime;

      console.log(
        `[${timestamp}] ${request.method} ${request.url} - (${duration}ms)`,
      );

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(
        `[${timestamp}] ${request.method} ${request.url} - Error (${duration}ms):`,
        error,
      );
      Sentry.captureException(error);

      throw error;
    }
  },
);
