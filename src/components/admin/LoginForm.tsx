"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-5">
      <label className="block">
        <span className="admin-label">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="admin-input mt-2"
        />
      </label>

      <label className="block">
        <span className="admin-label">Mot de passe</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="admin-input mt-2"
        />
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-[var(--terracotta-dark)]">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="admin-button w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
