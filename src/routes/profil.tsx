import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { profilQuery, perangkatQuery, statistikQuery } from "@/lib/desa";
import { StatistikPenduduk } from "@/components/statistik-penduduk";
import kantorImg from "@/assets/kantor-desa.jpg";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil & Pemerintahan Desa Sidokerto — Buduran, Sidoarjo" },
      {
        name: "description",
        content:
          "Sejarah singkat, visi misi, dan struktur perangkat Desa Sidokerto, Kecamatan Buduran, Kabupaten Sidoarjo.",
      },
      { property: "og:title", content: "Profil & Pemerintahan Desa Sidokerto" },
      {
        property: "og:description",
        content: "Visi misi dan struktur perangkat Desa Sidokerto, Buduran, Sidoarjo.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(profilQuery),
      context.queryClient.ensureQueryData(perangkatQuery),
      context.queryClient.ensureQueryData(statistikQuery),
    ]);
  },
  component: Profil,
  errorComponent: ({ error }) => (
    <PageShell>
      <p className="mx-auto max-w-6xl px-4 py-20 text-sm text-ink/70" role="alert">
        Halaman gagal dimuat: {error instanceof Error ? error.message : String(error)}
      </p>
    </PageShell>
  ),
});

function Profil() {
  const { data: profil } = useSuspenseQuery(profilQuery);
  const { data: perangkat } = useSuspenseQuery(perangkatQuery);
  const { data: statistik } = useSuspenseQuery(statistikQuery);

  return (
    <PageShell>
      <section className="relative z-10 px-4 pt-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl glass-panel">
          <div className="relative h-64 md:h-80">
            <img
              src={kantorImg}
              alt="Kantor Desa Sidokerto, Kecamatan Buduran, Kabupaten Sidoarjo"
              width={1280}
              height={768}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-200">
                Profil & Pemerintahan
              </span>
              <h1 className="mt-1 text-3xl font-extrabold text-brand-foreground md:text-4xl">
                {profil?.nama_desa ?? "Desa Sidokerto"}
              </h1>
              <p className="text-sm font-medium text-brand-foreground/80">
                {profil?.wilayah ?? "Kec. Buduran · Kab. Sidoarjo · Jawa Timur"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pt-5">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-3xl glass-panel p-8">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-accent-sky">
              Profil Desa
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">Sejarah Singkat</h2>
            <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-ink/65">
              {profil?.sejarah}
            </p>
          </div>
          <div className="rounded-3xl glass-panel p-8">
            <h2 className="font-display text-lg font-bold text-ink">Visi</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{profil?.visi}</p>
            <h2 className="mt-6 font-display text-lg font-bold text-ink">Misi</h2>
            <ul className="mt-2 space-y-2 text-sm text-ink/65">
              {(profil?.misi ?? []).map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-sky" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <StatistikPenduduk data={statistik} total={profil?.jumlah_penduduk ?? 0} />

      <section className="relative z-10 px-4 pt-5 pb-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-2xl font-extrabold text-ink">Struktur Perangkat Desa</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perangkat.map((orang) => (
              <div key={orang.id} className="flex flex-col gap-3 rounded-2xl glass-panel p-5">
                <div className="grid size-20 place-items-center overflow-hidden rounded-2xl bg-teal-100 outline outline-black/5">
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
