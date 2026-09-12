import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProfilDesa = {
  id: string;
  nama_desa: string;
  wilayah: string;
  sejarah: string;
  visi: string;
  misi: string[];
  jumlah_dusun: number;
  jumlah_rt: number;
  jumlah_rw: number;
  jumlah_penduduk: number;
  alamat_kantor: string;
  jam_layanan: string;
  telepon: string;
  email: string;
  maps_embed_url: string;
};

export type Perangkat = {
  id: string;
  nama: string;
  jabatan: string;
  foto_url: string;
  urutan: number;
};

export type KontenReligi = {
  id: string;
  slug: string;
  judul: string;
  isi: string;
  urutan: number;
};

export type Galeri = {
  id: string;
  judul: string;
  keterangan: string;
  gambar_url: string;
  urutan: number;
};

const db = supabase as unknown as {
  from: (table: string) => any;
};

export const profilQuery = queryOptions({
  queryKey: ["profil_desa"],
  queryFn: async (): Promise<ProfilDesa | null> => {
    const { data, error } = await db.from("profil_desa").select("*").limit(1).maybeSingle();
    if (error) throw new Error(error.message);
    return data as ProfilDesa | null;
  },
});

export const perangkatQuery = queryOptions({
  queryKey: ["perangkat_desa"],
  queryFn: async (): Promise<Perangkat[]> => {
    const { data, error } = await db.from("perangkat_desa").select("*").order("urutan");
    if (error) throw new Error(error.message);
    return (data ?? []) as Perangkat[];
  },
});

export const kontenReligiQuery = queryOptions({
  queryKey: ["konten_religi"],
  queryFn: async (): Promise<KontenReligi[]> => {
    const { data, error } = await db.from("konten_religi").select("*").order("urutan");
    if (error) throw new Error(error.message);
    return (data ?? []) as KontenReligi[];
  },
});

export const galeriQuery = queryOptions({
  queryKey: ["galeri"],
  queryFn: async (): Promise<Galeri[]> => {
    const { data, error } = await db.from("galeri").select("*").order("urutan");
    if (error) throw new Error(error.message);
    return (data ?? []) as Galeri[];
  },
});

export type Statistik = {
  id: string;
  kategori: string;
  label: string;
  jumlah: number;
  urutan: number;
};

export const KATEGORI_LABEL: Record<string, string> = {
  jenis_kelamin: "Jenis Kelamin",
  usia: "Kelompok Usia",
  pendidikan: "Pendidikan",
  pekerjaan: "Pekerjaan",
};

export const statistikQuery = queryOptions({
  queryKey: ["statistik_penduduk"],
  queryFn: async (): Promise<Statistik[]> => {
    const { data, error } = await db
      .from("statistik_penduduk")
      .select("*")
      .order("kategori")
      .order("urutan");
    if (error) throw new Error(error.message);
    return (data ?? []) as Statistik[];
  },
});

export const table = db;
