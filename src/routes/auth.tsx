import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk Admin — Desa Sidokerto" },
      { name: "description", content: "Halaman masuk perangkat Desa Sidokerto untuk mengelola konten website." },
      { property: "og:title", content: "Masuk Admin — Desa Sidokerto" },
      { property: "og:description", content: "Akses pengelolaan konten Sistem Informasi Desa Sidokerto." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "masuk") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        toast.success("Akun dibuat. Periksa email untuk konfirmasi, lalu minta hak admin.");
        setMode("masuk");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memproses");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <section className="relative z-10 px-4 pt-8 pb-20">
        <div className="mx-auto max-w-md rounded-3xl glass-panel p-8">
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-accent-sky">
            Area Perangkat Desa
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-ink">
            {mode === "masuk" ? "Masuk Admin" : "Daftar Akun"}
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Hanya akun yang diberi peran admin yang dapat mengubah konten website.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-ink/70">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/70 bg-white/70 px-4 py-2.5 text-ink outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-ink/70">Kata sandi</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/70 bg-white/70 px-4 py-2.5 text-ink outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl gradient-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-md disabled:opacity-60"
            >
              {busy ? "Memproses…" : mode === "masuk" ? "Masuk" : "Daftar"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setMode(mode === "masuk" ? "daftar" : "masuk")}
            className="mt-4 text-sm font-medium text-brand hover:underline"
          >
            {mode === "masuk" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </button>
        </div>
      </section>
    </PageShell>
  );
}
