import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({});

// function for signing out the user
export async function useSignIn(url = "/") {
  const data = await authClient.signIn.social({
    provider: "github",
    // callbackURL: "url",
  });
  return data;
}

// function for signing in the user
export async function useSignOut() {
  await authClient.signOut({
    // fetchOptions: {
    //   onSuccess: () => {
    //     router.push("/login"); // redirect to login page
    //   },
    // },
  });
}
