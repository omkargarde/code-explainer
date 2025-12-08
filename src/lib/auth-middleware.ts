import { createMiddleware } from "@tanstack/react-start";
import { auth } from "./auth";

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    try {
      console.log("Auth middleware: Getting session");
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      console.log("Auth middleware: Session retrieved", session?.user?.email);
      return next({
        context: {
          user: {
            id: session?.user.id,
            email: session?.user.email,
            name: session?.user.name,
          },
        },
      });
    } catch (error) {
      console.error("Auth middleware error:", error);
      throw new Error("Authentication failed");
    }
  },
);
