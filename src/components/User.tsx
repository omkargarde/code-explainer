import { getUser, useSignIn, useSignOut } from '@/lib/auth-client'

export default function User() {
  const { session, isPending, error } = getUser()
  if (error) {
    // TODO: redirect to error page
  }
  if (isPending) {
    return <h1>Loading</h1>
  }
  return session?.user ? (
    <button
      className="cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-3 align-middle font-semibold text-gray-200 transition-opacity hover:opacity-90 hover:shadow-lg"
      onClick={() => useSignOut()}
    >
      Sign out
    </button>
  ) : (
    <button
      className="cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-3 align-middle font-semibold text-gray-200 transition-opacity hover:opacity-90 hover:shadow-lg"
      onClick={() => useSignIn()}
    >
      Sign in
    </button>
  )
}
