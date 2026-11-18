import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/page-shell";
import { kontenReligiQuery, galeriQuery, profilQuery } from "@/lib/desa";
import makamImg from "@/assets/makam-aulia-sono.jpg";
import galeri1 from "@/assets/galeri-sono-1.jpg";
import galeri2 from "@/assets/galeri-sono-2.jpg";

const fallbackGaleri = [makamImg, galeri1, galeri2];

export const Route = createFileRoute("/religi")({
  head: () => ({
    meta: [
      { title: "Jelajah Religi Makam Aulia Sono — Desa Sidokerto" },
      {
        name: "description",
        content:
          "Sejarah, panduan akses, dan galeri Kompleks Makam Aulia Sono di Dusun Sono, Desa Sidokerto, Kec. Buduran, Sidoarjo.",
      },
      { property: "og:title", content: "Jelajah Religi Makam Aulia Sono" },
      {
        property: "og:description",
        content: "Kompleks ziarah lima makam ulama di Dusun Sono, Desa Sidokerto.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(kontenReligiQuery),
      context.queryClient.ensureQueryData(galeriQuery),
      context.queryClient.ensureQueryData(profilQuery),
    ]);
  },
  component: Religi,
  errorComponent: ({ error }) => (
    <PageShell>
      <p className="mx-auto max-w-6xl px-4 py-20 text-sm text-ink/70" role="alert">
        Halaman gagal dimuat: {error instanceof Error ? error.message : String(error)}
      </p>
    </PageShell>
  ),
});

function Religi() {
  const { data: konten } = useSuspenseQuery(kontenReligiQuery);
  const { data: galeri } = useSuspenseQuery(galeriQuery);
  const { data: profil } = useSuspenseQuery(profilQuery);

  return (
    <PageShell>
      <section className="relative z-10 px-4 pt-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl glass-panel">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[280px]">
              <img
                src={makamImg}
                alt="Kompleks Makam Aulia Sono"
                width={1024}
                height={1024}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="p-8">
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-accent-sky">
                Pusat Sejarah &amp; Ziarah
              </span>
              <h1 className="mt-2 text-3xl font-extrabold text-ink">
                Jelajah Religi &amp; Pusaka Sidokerto
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">
                Kawasan pusaka religi Desa Sidokerto, Kec. Buduran, Kab. Sidoarjo — berpusat di
                Dusun Sono.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pt-5">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
          {konten.map((bagian) => (
            <article key={bagian.id} className="rounded-3xl glass-panel p-7">
              <h2 className="font-display text-lg font-bold text-ink">{bagian.judul}</h2>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink/65">
                {bagian.isi}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-4 pt-5">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl glass-panel p-7">
            <h2 className="font-display text-lg font-bold text-ink">Peta Akses Peziarah</h2>
            <p className="mt-2 text-sm text-ink/60">
              Titik acuan menuju kawasan Dusun Sono, Desa Sidokerto, Kecamatan Buduran.
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/70">
              <iframe
                title="Peta kawasan Dusun Sono, Desa Sidokerto"
                src="https://www.google.com/maps?q=Dusun%20Sono%20Sidokerto%20Buduran%20Sidoarjo&output=embed"
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
          </div>
          <div className="rounded-3xl glass-panel p-7">
            <h2 className="font-display text-lg font-bold text-ink">Informasi Kunjungan</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs tracking-wide uppercase text-ink/45">Lokasi</dt>
                <dd className="text-ink/75">
                  Dusun Sono, Desa Sidokerto, Kec. Buduran, Kab. Sidoarjo, Jawa Timur
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-ink/45">Narahubung desa</dt>
                <dd className="text-ink/75">{profil?.telepon}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide uppercase text-ink/45">Catatan</dt>
                <dd className="text-ink/75">
                  Informasi jam ziarah dan fasilitas masih dalam pendataan perangkat desa.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pt-5 pb-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-2xl font-extrabold text-ink">Galeri &amp; Arsip</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {galeri.map((item, i) => (
              <figure key={item.id} className="overflow-hidden rounded-3xl glass-panel">
                <img
                  src={item.gambar_url || fallbackGaleri[i % fallbackGaleri.length]}
                  alt={item.judul}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="p-5">
                  <p className="font-display text-sm font-bold text-ink">{item.judul}</p>
                  <p className="mt-1 text-xs text-ink/55">{item.keterangan}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
