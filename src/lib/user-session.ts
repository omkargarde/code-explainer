"use client";
import { authClient } from "./auth-client";

// css to display user data
export function useUser() {
  "use client";
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();
  return { session, isPending, error, refetch };
}
