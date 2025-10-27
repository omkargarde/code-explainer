import { getUser, useSignIn, useSignOut } from '@/lib/auth-client'

export default function User() {
  const { session, isPending, error } = getUser()
  if (error) {
    // TODO: redirect to error page
  }
  if (isPending) {
    return (
      <button
        className="disabled cursor-not-allowed items-center justify-center rounded-lg bg-blue-500 px-4 py-3 align-middle font-semibold text-gray-200 transition-opacity hover:bg-blue-400 hover:shadow-lg"
        onClick={() => useSignOut()}
      >
        Loading
      </button>
    )
  }
  return session?.user ? (
    <button
      className="cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-3 align-middle font-semibold text-gray-200 transition-opacity hover:bg-blue-600 hover:shadow-lg"
      onClick={() => useSignOut()}
    >
      Sign out
    </button>
  ) : (
    <button
      className="cursor-pointer items-center justify-center rounded-lg bg-blue-500 px-4 py-3 align-middle font-semibold text-gray-200 transition-opacity hover:bg-blue-600 hover:shadow-lg"
      onClick={() => useSignIn()}
    >
      Sign in
    </button>
  )
}
