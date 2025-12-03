import type z from "zod";

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return `${path}: ${issue.message}`;
    })
    .join(", ");
}

export function createZodErrorResponse(error: z.ZodError) {
  return {
    success: false,
    error: {
      type: "ZodValidationError",
      message: formatZodError(error),
      details: {
        error: "Validation failed",
        message: error.issues.map((i) => i.message).join(", "),
        fieldErrors: error.issues.reduce(
          (acc, issue) => {
            const field = issue.path.join(".");
            acc[field] = issue.message;
            return acc;
          },
          {} as { [x: string]: string },
        ),
        issues: error.issues.map((issue) => ({
          code: issue.code,
          expected:
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            "expected" in issue && issue.expected !== undefined
              ? issue.expected
              : null,
          received:
            "received" in issue && issue.received !== undefined
              ? issue.received
              : null,
          path: issue.path,
          message: issue.message,
          input: issue.input ?? {},
        })),
      },
    },
  };
}
