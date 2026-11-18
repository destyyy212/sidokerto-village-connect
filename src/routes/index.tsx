import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { profilQuery, perangkatQuery } from "@/lib/desa";
import makamImg from "@/assets/makam-aulia-sono.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desa Sidokerto, Buduran, Sidoarjo — Sistem Informasi Desa" },
      {
        name: "description",
        content:
          "Portal resmi Desa Sidokerto, Kec. Buduran, Kab. Sidoarjo: profil wilayah, perangkat desa, layanan, dan Jelajah Religi Makam Aulia Sono.",
      },
      { property: "og:title", content: "Desa Sidokerto, Buduran, Sidoarjo" },
      {
        property: "og:description",
        content: "Sistem Informasi Desa Terpadu Desa Sidokerto, Kecamatan Buduran, Sidoarjo.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(profilQuery),
      context.queryClient.ensureQueryData(perangkatQuery),
    ]);
  },
  component: Beranda,
  errorComponent: ({ error }) => (
    <PageShell>
      <p className="mx-auto max-w-6xl px-4 py-20 text-sm text-ink/70" role="alert">
        Halaman gagal dimuat: {error instanceof Error ? error.message : String(error)}
      </p>
    </PageShell>
  ),
});

function Beranda() {
  const { data: profil } = useSuspenseQuery(profilQuery);
  const { data: perangkat } = useSuspenseQuery(perangkatQuery);

  return (
    <PageShell>
      <section className="relative z-10 px-4 pt-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl glass-panel p-8">
            <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-sky-300/40 blur-2xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                <span className="size-1.5 rounded-full bg-accent-sky" /> Sistem Informasi Desa Terpadu
              </span>
              <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold text-ink md:text-5xl">
                {profil?.nama_desa ?? "Desa Sidokerto"}
              </h1>
              <p className="mt-2 font-display text-lg font-semibold text-brand">
                {profil?.wilayah ?? "Kec. Buduran · Kab. Sidoarjo · Jawa Timur"}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">
                Portal resmi perangkat desa untuk mengelola konten, layanan, dan informasi warga —
                dengan pusat ziarah Makam Aulia Sono sebagai ikon budaya Sidokerto.
              </p>
            </div>
            <div className="relative mt-7 flex flex-wrap gap-3">
              <Link
                to="/religi"
                className="rounded-xl gradient-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-md"
              >
                Jelajahi Religi Sono
              </Link>
              <Link
                to="/profil"
                className="rounded-xl border border-white/70 bg-white/70 px-5 py-3 text-sm font-semibold text-ink"
              >
                Profil Pemerintahan
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl glass-panel p-5">
            <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 outline outline-black/5">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(#0f766e22 1px,transparent 1px),linear-gradient(90deg,#0f766e22 1px,transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative flex flex-col items-center gap-1">
                <span className="size-3 rounded-full bg-brand ring-4 ring-brand/20" />
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-brand/80">
                  Kantor Desa
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat value={profil?.jumlah_dusun ?? 0} label="Dusun" tone="text-brand" />
              <Stat value={profil?.jumlah_rt ?? 0} label="RT" tone="text-accent-sky" />
              <Stat value={profil?.jumlah_rw ?? 0} label="RW" tone="text-ink" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pt-5">
        <div className="mx-auto max-w-6xl">
          <div className="grid overflow-hidden rounded-3xl glass-panel md:grid-cols-2">
            <div className="relative min-h-[260px]">
              <img
                src={makamImg}
                alt="Kompleks Makam Aulia Sono di Dusun Sono, Desa Sidokerto"
                width={1024}
                height={1024}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="p-8">
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-accent-sky">
                Fitur Unggulan
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">
                Jelajah Religi Makam Aulia Sono
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">
                Kompleks ziarah lima makam ulama di Dusun Sono, termasuk pendiri Pondok Pesantren
                Sono KH. Muhayyin. Temukan narasi sejarah, panduan akses, dan galeri arsip kawasan
                pusaka.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Sejarah & Ziarah", "Peta Akses Rute", "Galeri Arsip"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to="/religi"
                className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-md"
              >
                Mulai Menjelajah
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pt-5 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-ink">Perangkat Desa</h2>
              <p className="text-sm text-ink/50">
                Data dikelola &amp; diperbarui dari database oleh admin.
              </p>
            </div>
            <Link to="/profil" className="text-sm font-semibold text-brand hover:underline">
              Lihat Struktur Lengkap
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perangkat.slice(0, 4).map((orang) => (
              <div key={orang.id} className="flex flex-col gap-3 rounded-2xl glass-panel p-5">
                <div className="grid size-20 place-items-center overflow-hidden rounded-2xl bg-sky-100 outline outline-black/5">
                  {orang.foto_url ? (
                    <img
                      src={orang.foto_url}
                      alt={`Foto ${orang.nama}`}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-brand/50">
                      Foto
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-ink">{orang.nama}</p>
                  <p className="text-xs font-medium text-brand">{orang.jabatan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/60 p-3 text-center">
      <p className={`font-display text-2xl font-extrabold ${tone}`}>{value}</p>
      <p className="text-[11px] font-medium text-ink/50">{label}</p>
    </div>
  );
}
