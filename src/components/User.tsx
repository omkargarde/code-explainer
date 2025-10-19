"use client";
import { useSignIn, useSignOut } from "@/lib/auth-client";
import { useUser } from "@/lib/user-session";

export default function User() {
  const { session, isPending, error } = useUser();
  if (error) {
    // TODO: redirect to error page
  }
  if (isPending) {
    return <h1>Loading</h1>;
  }
  return session?.user ? (
    <button onClick={() => useSignOut()}>Sign out</button>
  ) : (
    <button onClick={() => useSignIn()}>Sign in</button>
  );
}
