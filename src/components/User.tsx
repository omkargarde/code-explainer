import { ErrorComponent, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { authClient, useSignIn } from "@/lib/auth-client";

/**
 * Render authentication controls reflecting the current session state.
 *
 * Displays an error view if session retrieval failed; a disabled loading button while the session is pending; a "Sign out" button when a user is signed in (signing out navigates to the root path on success); and a "Sign in" button when no user is signed in.
 *
 * @returns The JSX element representing the current authentication UI.
 */
export default function User() {
  const navigate = useNavigate();
  const { data: session, error, isPending } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/" });
        },
      },
    });
  };

  if (error) {
    return <ErrorComponent error={error} />;
  }
  if (isPending) {
    return (
      <button className="btn btn-primary" disabled>
        <Loader2 /> loading
      </button>
    );
  }
  return session?.user ? (
    <button className="btn btn-primary" onClick={signOut}>
      Sign out
    </button>
  ) : (
    <button className="btn btn-primary" onClick={() => useSignIn()}>
      Sign in
    </button>
  );
}