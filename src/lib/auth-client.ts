import { redirect } from "@tanstack/react-router";
import { createAuthClient } from "better-auth/react";
import { ENV } from "@/Env";

export const authClient = createAuthClient({
  basePath: ENV.BETTER_AUTH_URL,
});

// function for signing out the user
export async function useSignIn() {
  const data = await authClient.signIn.social({
    provider: "github",
    callbackURL: "/",
  });
  return data;
}

// function for signing in the user
export async function useSignOut() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        throw redirect({
          to: "/",
        });
      },
      // onError:()=>{
      // throw redirect({
      // to
      // })
      // }
    },
  });
}
