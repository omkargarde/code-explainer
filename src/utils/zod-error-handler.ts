import type z from "zod";

export function createZodErrorResponse(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return `${path}: ${issue.message}`;
    })
    .join(", ");
}
 