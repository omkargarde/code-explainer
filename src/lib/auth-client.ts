import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({})

// function for signing out the user
export async function useSignIn() {
  const data = await authClient.signIn.social({
    provider: 'github',
    callbackURL: '/code',
  })
  return data
}

// function for signing in the user
export async function useSignOut() {
  await authClient.signOut({
    // fetchOptions: {
    //   onSuccess: () => {
    //     router.push("/login"); // redirect to login page
    //   },
    // },
  })
}

// css to display user data
export function getUser() {
  const {
    data: session,
    isPending, // loading state
    error, // error object
    refetch, // refetch the session
  } = authClient.useSession()
  return { session, isPending, error, refetch }
}
