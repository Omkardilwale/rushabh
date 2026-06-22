"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Invalid password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-maroon-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gold/25 bg-ivory p-8 shadow-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
          Rushabh Admin
        </p>
        <h1 className="mt-2 font-serif text-3xl text-maroon">Sign in</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Manage site content, products, rates, and contact details.
        </p>
        <label className="mt-8 block text-sm font-medium text-maroon">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gold/25 bg-white px-4 py-3 outline-none focus:border-maroon"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full gold-gradient py-3 text-sm font-semibold uppercase tracking-wider text-maroon-dark disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Enter admin"}
        </button>
      </form>
    </div>
  );
}
