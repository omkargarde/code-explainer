import { ErrorComponent, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { authClient, useSignIn } from "@/lib/auth-client";

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
