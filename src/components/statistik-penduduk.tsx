import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { KATEGORI_LABEL, type Statistik } from "@/lib/desa";

const Charts = lazy(() => import("./statistik-charts"));

export function StatistikPenduduk({ data, total }: { data: Statistik[]; total: number }) {
  const kategori = Object.keys(KATEGORI_LABEL).filter((k) => data.some((d) => d.kategori === k));
  const jumlahTotal = total || data.filter((d) => d.kategori === "jenis_kelamin").reduce((a, b) => a + b.jumlah, 0);

  return (
    <section className="relative z-10 px-4 pt-5">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">Statistik Kependudukan</h2>
            <p className="text-sm text-ink/50">Data dikelola oleh admin desa dan dapat diperbarui sewaktu-waktu.</p>
          </div>
          <div className="rounded-2xl glass-panel px-5 py-3 text-right">
            <p className="font-display text-3xl font-extrabold text-brand">{jumlahTotal.toLocaleString("id-ID")}</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/50">Total Penduduk</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {kategori.map((k) => {
            const rows = data.filter((d) => d.kategori === k);
            return (
              <div key={k} className="rounded-3xl glass-panel p-5">
                <h3 className="font-display text-sm font-bold text-ink">{KATEGORI_LABEL[k]}</h3>
                <div className="mt-3 h-56">
                  <ClientOnly fallback={<Fallback rows={rows} />}>
                    <Suspense fallback={<Fallback rows={rows} />}>
                      <Charts rows={rows} pie={k === "jenis_kelamin"} />
                    </Suspense>
                  </ClientOnly>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Fallback({ rows }: { rows: Statistik[] }) {
  return (
    <ul className="space-y-1 text-sm text-ink/70">
      {rows.map((r) => (
        <li key={r.id} className="flex justify-between">
          <span>{r.label}</span>
          <span className="font-semibold text-ink">{r.jumlah.toLocaleString("id-ID")}</span>
        </li>
      ))}
    </ul>
  );
}
