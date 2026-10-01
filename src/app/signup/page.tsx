"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const { data, error: signupError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim().toLowerCase(),
          display_name: displayName.trim(),
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setMessage(
        "Account created. Check your email to confirm your account.",
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your Sinetr account.
        </h1>

        <p className="mt-2 text-sm text-muted">
          Start building your fitness history.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-border-strong"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9_]+"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-border-strong"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-border-strong"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-border-strong"
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          {message && <p className="text-sm text-muted">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-signal px-4 py-3 text-sm font-semibold transition-colors hover:bg-signal-dark disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}