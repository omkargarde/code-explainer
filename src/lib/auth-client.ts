import { redirect } from "@tanstack/react-router";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({});

/**
 * Initiates a GitHub social sign-in flow and returns the provider's response.
 *
 * @returns The response data from the social sign-in request (provider auth/session data).
 */
export async function useSignIn() {
  const data = await authClient.signIn.social({
    provider: "github",
    callbackURL: "/",
  });
  return data;
}

// TODO: experiment with server function
/**
 * Sign out the current user and navigate to the root path on success.
 *
 * Initiates sign-out via the authentication client; on successful sign-out this function throws a redirect to "/" to perform navigation.
 */
export async function useSignOut() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        throw redirect({ to: "/" });
      },
    },
  });
}