import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { profilQuery } from "@/lib/desa";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak & Layanan Informasi — Desa Sidokerto, Buduran" },
      {
        name: "description",
        content:
          "Alamat kantor, jam operasional, telepon, email, dan peta lokasi Kantor Desa Sidokerto, Kec. Buduran, Kab. Sidoarjo.",
      },
      { property: "og:title", content: "Kontak & Layanan Desa Sidokerto" },
      {
        property: "og:description",
        content: "Alamat, jam layanan, dan peta lokasi Kantor Desa Sidokerto, Buduran, Sidoarjo.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profilQuery),
  component: Kontak,
  errorComponent: ({ error }) => (
    <PageShell>
      <p className="mx-auto max-w-6xl px-4 py-20 text-sm text-ink/70" role="alert">
        Halaman gagal dimuat: {error.message}
      </p>
    </PageShell>
  ),
});

function Kontak() {
  const { data: profil } = useSuspenseQuery(profilQuery);

  return (
    <PageShell>
      <section className="relative z-10 px-4 pt-8 pb-16">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl glass-panel p-8">
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-accent-sky">
              Layanan Informasi
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-ink">Kontak Kantor Desa</h1>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-xs tracking-wide uppercase text-ink/45">Alamat</dt>
                <dd className="mt-1 text-ink/75">{profil?.alamat_kantor}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-ink/45">Jam Operasional</dt>
                <dd className="mt-1 text-ink/75">{profil?.jam_layanan}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-ink/45">Telepon</dt>
                <dd className="mt-1 text-ink/75">{profil?.telepon}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-ink/45">Email</dt>
                <dd className="mt-1 text-ink/75">{profil?.email}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-3xl glass-panel p-5">
            <div className="overflow-hidden rounded-2xl border border-white/70">
              <iframe
                title="Peta lokasi Kantor Desa Sidokerto"
                src={
                  profil?.maps_embed_url ||
                  "https://www.google.com/maps?q=Desa%20Sidokerto%20Buduran%20Sidoarjo&output=embed"
                }
                className="h-[460px] w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
