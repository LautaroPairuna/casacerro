"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };
        setError(body.message ?? "No fue posible iniciar sesión.");
        return;
      }

      window.location.assign("/admin/tarifas");
    } catch {
      setError("Error de conexión. Intentalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="cc-anim-fade-in absolute left-[-14rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full bg-[#fcb040]/20 blur-[120px]"
        style={{ ["--anim-duration" as string]: "0.5s" }}
      />
      <div
        className="cc-anim-fade-in absolute right-[-16rem] bottom-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[#6c1710]/15 blur-[130px]"
        style={{ ["--anim-duration" as string]: "0.6s", ["--anim-delay" as string]: "0.05s" }}
      />
      <div
        className="cc-anim-fade-in absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(252,176,64,0.12),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(108,23,16,0.16),transparent_42%)]"
        style={{ ["--anim-duration" as string]: "0.65s", ["--anim-delay" as string]: "0.08s" }}
      />

      <div
        className="cc-anim-fade-up relative z-10 w-full max-w-md rounded-3xl border border-[#e0d5bf] bg-white/95 p-8 shadow-[0_14px_40px_rgba(71,41,10,0.12)] backdrop-blur-sm"
        style={{
          ["--anim-duration" as string]: "0.42s",
          ["--anim-scale-from" as string]: "0.98",
        }}
      >
        <div className="mb-6 space-y-3">
          <span className="inline-flex items-center rounded-full border border-[#eadcc2] bg-[#fff8e7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a87b51]">
            Acceso Admin
          </span>
          <h2 className="text-4xl text-neutral-900">Iniciar sesión</h2>
          <div className="h-0.5 w-20 bg-[#fcb040]" />
          <p className="text-sm text-neutral-600">Acceso exclusivo para administración.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-900" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#d9cdb6] bg-[#fffdf8] px-3 py-2.5 text-neutral-900 placeholder:text-neutral-500 outline-none ring-[#6c1710] transition focus:border-[#b68b60] focus:ring-2"
              style={{ color: "#171717", WebkitTextFillColor: "#171717" }}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-900" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#d9cdb6] bg-[#fffdf8] px-3 py-2.5 text-neutral-900 placeholder:text-neutral-500 outline-none ring-[#6c1710] transition focus:border-[#b68b60] focus:ring-2"
              style={{ color: "#171717", WebkitTextFillColor: "#171717" }}
            />
          </div>

          {error && (
            <p
              key={error}
              className="cc-anim-toast-in rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6c1710] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
