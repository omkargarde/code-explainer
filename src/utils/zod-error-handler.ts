import type z from "zod";

export function handleZodError(error: z.ZodError) {
  const fieldErrors = error.issues.reduce(
    (acc, issue) => {
      const field = issue.path.join(".");
      acc[field] = issue.message;
      return acc;
    },
    {} as Record<string, string>,
  );

  const message = error.issues.map((i) => i.message).join(", ");

  return {
    error: "Validation failed",
    message,
    fieldErrors,
    issues: error.issues,
  };
}

export function formatZodError(error: z.ZodError): string {
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
          {} as Record<string, string>,
        ),
        issues: error.issues.map((issue) => ({
          code: issue.code,
          expected: "expected" in issue ? issue.expected : undefined,
          received: "received" in issue ? issue.received : undefined,
          path: issue.path,
          message: issue.message,
          input: issue.input,
        })),
      },
    },
  };
}
