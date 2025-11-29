import { ErrorComponent } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { authClient, useSignIn, useSignOut } from "@/lib/auth-client";

export default function User() {
  const { data: session, error, isPending } = authClient.useSession();
  if (error) {
    <ErrorComponent error={error} />;
  }
  if (isPending) {
    return (
      <button className="btn btn-primary" disabled>
        <Loader2 /> loading
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
