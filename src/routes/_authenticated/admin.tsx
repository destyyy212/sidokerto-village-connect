import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { sanitizeNonNegativeInteger } from "@/lib/admin-numeric";
import { uploadAdminFile } from "@/lib/admin-uploads";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  table,
  profilQuery,
  perangkatQuery,
  kontenReligiQuery,
  galeriQuery,
  statistikQuery,
  KATEGORI_LABEL,
  type ProfilDesa,
  type Perangkat,
  type KontenReligi,
  type Galeri,
  type Statistik,
} from "@/lib/desa";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin — Desa Sidokerto" },
      { name: "description", content: "Kelola profil, perangkat, statistik penduduk, dan konten Desa Sidokerto." },
      { property: "og:title", content: "Panel Admin — Desa Sidokerto" },
      { property: "og:description", content: "Pengelolaan konten Sistem Informasi Desa Sidokerto." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const tabs = [
  { id: "profil", label: "Profil & Layanan" },
  { id: "perangkat", label: "Perangkat Desa" },
  { id: "statistik", label: "Kependudukan" },
  { id: "religi", label: "Konten Religi" },
  { id: "galeri", label: "Galeri" },
] as const;
type TabId = (typeof tabs)[number]["id"];

const inputCls =
  "mt-1 min-h-11 w-full rounded-xl border border-white/70 bg-white/70 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-ring";
const btnPrimary =
  "min-h-11 rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-md disabled:opacity-60";
const btnGhost = "min-h-10 rounded-lg border border-brand/20 bg-white/60 px-4 py-2 text-xs font-semibold text-brand";
const btnDanger = "min-h-10 rounded-lg border border-destructive/30 bg-white/60 px-4 py-2 text-xs font-semibold text-destructive";

function AdminPage() {
  const { session, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<TabId>("profil");
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function keluar() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <PageShell>
      <section className="relative z-10 px-4 pt-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4 rounded-3xl glass-panel p-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-accent-sky">Panel Admin</span>
              <h1 className="mt-1 text-2xl font-extrabold text-ink">Kelola Konten Desa</h1>
              <p className="text-sm text-ink/60">{session?.user.email}</p>
            </div>
            <button type="button" onClick={keluar} className={btnGhost}>
              Keluar
            </button>
          </div>

          {loading ? null : !isAdmin ? (
            <div className="mt-5 rounded-3xl glass-panel p-8" role="alert">
              <h2 className="text-lg font-bold text-ink">Akun belum memiliki hak admin</h2>
              <p className="mt-2 text-sm text-ink/60">
                Anda sudah masuk, tetapi akun ini belum diberi peran admin. Hubungi pengelola sistem untuk
                mengaktifkan hak akses.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-wrap gap-2">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      tab === t.id ? "gradient-brand text-brand-foreground shadow-md" : "bg-white/60 text-ink/70"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                {tab === "profil" && <ProfilForm />}
                {tab === "perangkat" && <PerangkatEditor />}
                {tab === "statistik" && <StatistikEditor />}
                {tab === "religi" && <ReligiEditor />}
                {tab === "galeri" && <GaleriEditor />}
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function useInvalidate(keys: string[]) {
  const qc = useQueryClient();
  return () => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
}

/* ---------------- Profil ---------------- */
function ProfilForm() {
  const { data } = useQuery(profilQuery);
  if (data === undefined) return <p className="text-sm text-ink/60">Memuat…</p>;
  return <ProfilFields key={data?.id ?? "baru"} profil={data} />;
}

function ProfilFields({ profil }: { profil: ProfilDesa | null }) {
  const [form, setForm] = useState({
    nama_desa: profil?.nama_desa ?? "Desa Sidokerto",
    wilayah: profil?.wilayah ?? "Kec. Buduran · Kab. Sidoarjo · Jawa Timur",
    sejarah: profil?.sejarah ?? "",
    visi: profil?.visi ?? "",
    misi: (profil?.misi ?? []).join("\n"),
    jumlah_dusun: profil?.jumlah_dusun ? String(profil.jumlah_dusun) : "",
    jumlah_rt: profil?.jumlah_rt ? String(profil.jumlah_rt) : "",
    jumlah_rw: profil?.jumlah_rw ? String(profil.jumlah_rw) : "",
    jumlah_penduduk: profil?.jumlah_penduduk ? String(profil.jumlah_penduduk) : "",
    alamat_kantor: profil?.alamat_kantor ?? "",
    jam_layanan: profil?.jam_layanan ?? "",
    telepon: profil?.telepon ?? "",
    email: profil?.email ?? "",
    maps_embed_url: profil?.maps_embed_url ?? "",
  });
  const [busy, setBusy] = useState(false);
  const invalidate = useInvalidate(["profil_desa"]);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function simpan() {
    setBusy(true);
    const payload = {
      ...form,
      jumlah_dusun: Number(form.jumlah_dusun || 0),
      jumlah_rt: Number(form.jumlah_rt || 0),
      jumlah_rw: Number(form.jumlah_rw || 0),
      jumlah_penduduk: Number(form.jumlah_penduduk || 0),
      misi: form.misi.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    const q = profil
      ? table.from("profil_desa").update(payload).eq("id", profil.id)
      : table.from("profil_desa").insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profil desa tersimpan");
    invalidate();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-3xl glass-panel p-6 space-y-3">
        <h2 className="font-bold text-ink">Identitas & Profil</h2>
        <Field label="Nama desa" value={form.nama_desa} onChange={(v) => set("nama_desa", v)} />
        <Field label="Wilayah" value={form.wilayah} onChange={(v) => set("wilayah", v)} />
        <Field label="Sejarah singkat" value={form.sejarah} onChange={(v) => set("sejarah", v)} multiline />
        <Field label="Visi" value={form.visi} onChange={(v) => set("visi", v)} multiline />
        <Field label="Misi (satu per baris)" value={form.misi} onChange={(v) => set("misi", v)} multiline />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumField label="Dusun" value={form.jumlah_dusun} onChange={(v) => set("jumlah_dusun", v)} />
          <NumField label="RT" value={form.jumlah_rt} onChange={(v) => set("jumlah_rt", v)} />
          <NumField label="RW" value={form.jumlah_rw} onChange={(v) => set("jumlah_rw", v)} />
          <NumField label="Penduduk" value={form.jumlah_penduduk} onChange={(v) => set("jumlah_penduduk", v)} />
        </div>
      </div>
      <div className="rounded-3xl glass-panel p-6 space-y-3">
        <h2 className="font-bold text-ink">Layanan & Kontak</h2>
        <Field label="Alamat kantor" value={form.alamat_kantor} onChange={(v) => set("alamat_kantor", v)} multiline />
        <Field label="Jam layanan" value={form.jam_layanan} onChange={(v) => set("jam_layanan", v)} />
        <Field label="Telepon" value={form.telepon} onChange={(v) => set("telepon", v)} />
        <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
        <Field label="URL embed Google Maps" value={form.maps_embed_url} onChange={(v) => set("maps_embed_url", v)} />
        <button type="button" onClick={simpan} disabled={busy} className={`${btnPrimary} w-full sm:w-auto`}>
          {busy ? "Menyimpan…" : "Simpan Profil"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Perangkat ---------------- */
function PerangkatEditor() {
  const { data = [] } = useQuery(perangkatQuery);
  const invalidate = useInvalidate(["perangkat_desa"]);
  const [baru, setBaru] = useState({ nama: "", jabatan: "", foto_url: "" });

  async function tambah() {
    if (!baru.nama || !baru.jabatan) { toast.error("Nama dan jabatan wajib diisi"); return; }
    const { error } = await table.from("perangkat_desa").insert({ ...baru, urutan: data.length + 1 });
    if (error) { toast.error(error.message); return; }
    setBaru({ nama: "", jabatan: "", foto_url: "" });
    toast.success("Perangkat ditambahkan");
    invalidate();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl glass-panel p-6">
        <h2 className="font-bold text-ink">Tambah Perangkat</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Nama" value={baru.nama} onChange={(v) => setBaru({ ...baru, nama: v })} />
          <Field label="Jabatan" value={baru.jabatan} onChange={(v) => setBaru({ ...baru, jabatan: v })} />
          <FileField label="Foto perangkat" value={baru.foto_url} onChange={(v) => setBaru({ ...baru, foto_url: v })} />
        </div>
        <button type="button" onClick={tambah} className={`mt-3 ${btnPrimary}`}>
          Tambah
        </button>
      </div>
      <div className="space-y-3">
        {data.map((p) => (
          <PerangkatRow key={p.id} item={p} onDone={invalidate} />
        ))}
      </div>
    </div>
  );
}

function PerangkatRow({ item, onDone }: { item: Perangkat; onDone: () => void }) {
  const [f, setF] = useState({ nama: item.nama, jabatan: item.jabatan, foto_url: item.foto_url });
  async function simpan() {
    const { error } = await table.from("perangkat_desa").update(f).eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Tersimpan");
    onDone();
  }
  async function hapus() {
    if (!confirm(`Hapus ${item.nama}?`)) return;
    const { error } = await table.from("perangkat_desa").delete().eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    onDone();
  }
  return (
    <div className="grid gap-3 rounded-2xl glass-panel p-4 sm:grid-cols-[1fr_1fr_1fr_80px_auto] sm:items-end">
      <Field label="Nama" value={f.nama} onChange={(v) => setF({ ...f, nama: v })} />
      <Field label="Jabatan" value={f.jabatan} onChange={(v) => setF({ ...f, jabatan: v })} />
      <FileField label="Foto perangkat" value={f.foto_url} onChange={(v) => setF({ ...f, foto_url: v })} />
      <div className="flex gap-2">
        <button type="button" onClick={simpan} className={`${btnGhost} flex-1 sm:flex-none`}>Simpan</button>
        <button type="button" onClick={hapus} className={`${btnDanger} flex-1 sm:flex-none`}>Hapus</button>
      </div>
    </div>
  );
}

/* ---------------- Statistik ---------------- */
function StatistikEditor() {
  const { data = [] } = useQuery(statistikQuery);
  const invalidate = useInvalidate(["statistik_penduduk"]);
  const [baru, setBaru] = useState({ kategori: "jenis_kelamin", label: "", jumlah: "" });

  async function tambah() {
    if (!baru.label) { toast.error("Label wajib diisi"); return; }
    const { error } = await table.from("statistik_penduduk").insert({ ...baru, jumlah: Number(baru.jumlah || 0), urutan: data.length + 1 });
    if (error) { toast.error(error.message); return; }
    setBaru({ ...baru, label: "", jumlah: "" });
    toast.success("Data ditambahkan");
    invalidate();
  }

  const kategoriList = Object.keys(KATEGORI_LABEL);
  return (
    <div className="space-y-5">
      <div className="rounded-3xl glass-panel p-6">
        <h2 className="font-bold text-ink">Tambah Data Kependudukan</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium text-ink/70">Kategori</span>
            <select className={inputCls} value={baru.kategori} onChange={(e) => setBaru({ ...baru, kategori: e.target.value })}>
              {kategoriList.map((k) => (
                <option key={k} value={k}>{KATEGORI_LABEL[k]}</option>
              ))}
            </select>
          </label>
          <Field label="Label (mis. Laki-laki)" value={baru.label} onChange={(v) => setBaru({ ...baru, label: v })} />
          <NumField label="Jumlah jiwa" value={baru.jumlah} onChange={(v) => setBaru({ ...baru, jumlah: v })} />
        </div>
        <button type="button" onClick={tambah} className={`mt-3 ${btnPrimary}`}>Tambah</button>
      </div>
      {kategoriList.map((k) => {
        const rows = data.filter((d) => d.kategori === k);
        if (!rows.length) return null;
        return (
          <div key={k} className="rounded-3xl glass-panel p-5">
            <h3 className="mb-3 font-bold text-ink">{KATEGORI_LABEL[k]}</h3>
            <div className="space-y-2">
              {rows.map((r) => (
                <StatRow key={r.id} item={r} onDone={invalidate} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatRow({ item, onDone }: { item: Statistik; onDone: () => void }) {
  const [f, setF] = useState({ label: item.label, jumlah: item.jumlah ? String(item.jumlah) : "" });
  async function simpan() {
    const { error } = await table.from("statistik_penduduk").update({ ...f, jumlah: Number(f.jumlah || 0) }).eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Tersimpan");
    onDone();
  }
  async function hapus() {
    if (!confirm(`Hapus ${item.label}?`)) return;
    const { error } = await table.from("statistik_penduduk").delete().eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    onDone();
  }
  return (
      <div className="grid gap-3 rounded-2xl bg-white/50 p-3 sm:grid-cols-[1fr_150px_auto] sm:items-end">
      <Field label="Label" value={f.label} onChange={(v) => setF({ ...f, label: v })} />
      <NumField label="Jumlah" value={f.jumlah} onChange={(v) => setF({ ...f, jumlah: v })} />
      <div className="flex gap-2">
        <button type="button" onClick={simpan} className={`${btnGhost} flex-1 sm:flex-none`}>Simpan</button>
        <button type="button" onClick={hapus} className={`${btnDanger} flex-1 sm:flex-none`}>Hapus</button>
      </div>
    </div>
  );
}

/* ---------------- Religi ---------------- */
function ReligiEditor() {
  const { data = [] } = useQuery(kontenReligiQuery);
  const invalidate = useInvalidate(["konten_religi"]);
  return (
    <div className="space-y-4">
      {data.map((k) => (
        <ReligiRow key={k.id} item={k} onDone={invalidate} />
      ))}
    </div>
  );
}

function ReligiRow({ item, onDone }: { item: KontenReligi; onDone: () => void }) {
  const [f, setF] = useState({ judul: item.judul, isi: item.isi });
  async function simpan() {
    const { error } = await table.from("konten_religi").update(f).eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Tersimpan");
    onDone();
  }
  return (
    <div className="rounded-3xl glass-panel p-5 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/70">{item.slug}</p>
      <Field label="Judul" value={f.judul} onChange={(v) => setF({ ...f, judul: v })} />
      <Field label="Isi" value={f.isi} onChange={(v) => setF({ ...f, isi: v })} multiline rows={6} />
      <button type="button" onClick={simpan} className={btnPrimary}>Simpan</button>
    </div>
  );
}

/* ---------------- Galeri ---------------- */
function GaleriEditor() {
  const { data = [] } = useQuery(galeriQuery);
  const invalidate = useInvalidate(["galeri"]);
  const [baru, setBaru] = useState({ judul: "", keterangan: "", gambar_url: "" });

  async function tambah() {
    if (!baru.judul || !baru.gambar_url) { toast.error("Judul dan URL gambar wajib diisi"); return; }
    const { error } = await table.from("galeri").insert({ ...baru, urutan: data.length + 1 });
    if (error) { toast.error(error.message); return; }
    setBaru({ judul: "", keterangan: "", gambar_url: "" });
    toast.success("Foto ditambahkan");
    invalidate();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl glass-panel p-6">
        <h2 className="font-bold text-ink">Tambah Foto Galeri</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Judul" value={baru.judul} onChange={(v) => setBaru({ ...baru, judul: v })} />
          <Field label="Keterangan" value={baru.keterangan} onChange={(v) => setBaru({ ...baru, keterangan: v })} />
          <FileField label="Foto atau dokumen galeri" value={baru.gambar_url} onChange={(v) => setBaru({ ...baru, gambar_url: v })} />
        </div>
        <button type="button" onClick={tambah} className={`mt-3 ${btnPrimary}`}>Tambah</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.map((g) => (
          <GaleriRow key={g.id} item={g} onDone={invalidate} />
        ))}
      </div>
    </div>
  );
}

function GaleriRow({ item, onDone }: { item: Galeri; onDone: () => void }) {
  const [f, setF] = useState({ judul: item.judul, keterangan: item.keterangan, gambar_url: item.gambar_url });
  async function simpan() {
    const { error } = await table.from("galeri").update(f).eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Tersimpan");
    onDone();
  }
  async function hapus() {
    if (!confirm(`Hapus ${item.judul}?`)) return;
    const { error } = await table.from("galeri").delete().eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    onDone();
  }
  return (
    <div className="rounded-3xl glass-panel p-4 space-y-3">
      {f.gambar_url && (
        <img src={f.gambar_url} alt={f.judul} loading="lazy" className="aspect-video w-full rounded-xl object-cover" />
      )}
      <Field label="Judul" value={f.judul} onChange={(v) => setF({ ...f, judul: v })} />
      <Field label="Keterangan" value={f.keterangan} onChange={(v) => setF({ ...f, keterangan: v })} />
      <FileField label="Foto atau dokumen galeri" value={f.gambar_url} onChange={(v) => setF({ ...f, gambar_url: v })} />
      <div className="flex gap-2">
        <button type="button" onClick={simpan} className={`${btnGhost} flex-1 sm:flex-none`}>Simpan</button>
        <button type="button" onClick={hapus} className={`${btnDanger} flex-1 sm:flex-none`}>Hapus</button>
      </div>
    </div>
  );
}

/* ---------------- Fields ---------------- */
function Field({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-ink/70">{label}</span>
      {multiline ? (
        <textarea rows={rows} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number | string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-ink/70">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        className={inputCls}
        value={value}
        onChange={(e) => onChange(sanitizeNonNegativeInteger(e.target.value))}
      />
    </label>
  );
}
