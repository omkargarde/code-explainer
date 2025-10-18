import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="mb-6 flex w-full max-w-4xl items-center justify-between">
      <h1 className="text-2xl font-bold">Code Explainer</h1>
    </header>
  );
}
