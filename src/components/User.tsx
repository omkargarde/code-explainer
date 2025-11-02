import { getUser, useSignIn, useSignOut } from "@/lib/auth-client";

export default function User() {
  const { session, isPending, error } = getUser();
  if (error) {
    // TODO: redirect to error page
  }
  if (isPending) {
    return (
      <button className="btn btn-primary" onClick={() => useSignOut()}>
        Loading
      </button>
    );
  }
  return session?.user ? (
    <button className="btn btn-primary" onClick={() => useSignOut()}>
      Sign out
    </button>
  ) : (
    <button className="btn btn-primary" onClick={() => useSignIn()}>
      Sign in
    </button>
  );
}
