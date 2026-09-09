CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Pengguna melihat perannya sendiri" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Profil desa (baris tunggal)
CREATE TABLE public.profil_desa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_desa text NOT NULL DEFAULT 'Desa Sidokerto',
  wilayah text NOT NULL DEFAULT 'Kec. Buduran · Kab. Sidoarjo · Jawa Timur',
  sejarah text NOT NULL DEFAULT '',
  visi text NOT NULL DEFAULT '',
  misi text[] NOT NULL DEFAULT '{}',
  jumlah_dusun integer NOT NULL DEFAULT 0,
  jumlah_rt integer NOT NULL DEFAULT 0,
  jumlah_rw integer NOT NULL DEFAULT 0,
  jumlah_penduduk integer NOT NULL DEFAULT 0,
  alamat_kantor text NOT NULL DEFAULT '',
  jam_layanan text NOT NULL DEFAULT '',
  telepon text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  maps_embed_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profil_desa TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profil_desa TO authenticated;
GRANT ALL ON public.profil_desa TO service_role;
ALTER TABLE public.profil_desa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profil desa dapat dilihat semua orang" ON public.profil_desa FOR SELECT USING (true);
CREATE POLICY "Admin mengelola profil desa" ON public.profil_desa FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_profil_desa_updated BEFORE UPDATE ON public.profil_desa
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Perangkat desa
CREATE TABLE public.perangkat_desa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  jabatan text NOT NULL,
  foto_url text NOT NULL DEFAULT '',
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.perangkat_desa TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perangkat_desa TO authenticated;
GRANT ALL ON public.perangkat_desa TO service_role;
ALTER TABLE public.perangkat_desa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perangkat desa dapat dilihat semua orang" ON public.perangkat_desa FOR SELECT USING (true);
CREATE POLICY "Admin mengelola perangkat desa" ON public.perangkat_desa FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_perangkat_desa_updated BEFORE UPDATE ON public.perangkat_desa
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Konten halaman religi
CREATE TABLE public.konten_religi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  judul text NOT NULL,
  isi text NOT NULL DEFAULT '',
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.konten_religi TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.konten_religi TO authenticated;
GRANT ALL ON public.konten_religi TO service_role;
ALTER TABLE public.konten_religi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Konten religi dapat dilihat semua orang" ON public.konten_religi FOR SELECT USING (true);
CREATE POLICY "Admin mengelola konten religi" ON public.konten_religi FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_konten_religi_updated BEFORE UPDATE ON public.konten_religi
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Galeri
CREATE TABLE public.galeri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  keterangan text NOT NULL DEFAULT '',
  gambar_url text NOT NULL DEFAULT '',
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.galeri TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeri TO authenticated;
GRANT ALL ON public.galeri TO service_role;
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Galeri dapat dilihat semua orang" ON public.galeri FOR SELECT USING (true);
CREATE POLICY "Admin mengelola galeri" ON public.galeri FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_galeri_updated BEFORE UPDATE ON public.galeri
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Data awal
INSERT INTO public.profil_desa (sejarah, visi, misi, jumlah_dusun, jumlah_rt, jumlah_rw, jumlah_penduduk, alamat_kantor, jam_layanan, telepon, email, maps_embed_url) VALUES (
'Desa Sidokerto berada di wilayah Kecamatan Buduran, Kabupaten Sidoarjo, Provinsi Jawa Timur. Salah satu kawasan yang dikenal luas di desa ini adalah Dusun Sono, tempat berdirinya Pondok Pesantren Sono dan kompleks Makam Aulia Sono. (Catatan: uraian sejarah ini masih ringkas dan dapat dilengkapi oleh perangkat desa melalui halaman admin.)',
'Terwujudnya Desa Sidokerto yang religius, tertib, dan sejahtera melalui pelayanan publik yang terbuka. (Contoh — dapat diperbarui admin.)',
ARRAY['Meningkatkan kualitas pelayanan administrasi warga','Merawat dan mengembangkan kawasan pusaka religi Dusun Sono','Mendorong keterbukaan informasi pembangunan desa'],
5, 58, 10, 0,
'Kantor Desa Sidokerto, Kec. Buduran, Kab. Sidoarjo, Jawa Timur (alamat lengkap menyusul — lengkapi lewat halaman admin)',
'Senin – Kamis 08.00 – 15.00 WIB · Jumat 08.00 – 11.30 WIB',
'(031) 000-0000 (contoh — mohon diperbarui)',
'info@sidokerto.desa.id (contoh — mohon diperbarui)',
'https://www.google.com/maps?q=Desa%20Sidokerto%20Buduran%20Sidoarjo&output=embed');

INSERT INTO public.perangkat_desa (nama, jabatan, foto_url, urutan) VALUES
('(Nama belum diisi)', 'Kepala Desa', '', 1),
('(Nama belum diisi)', 'Sekretaris Desa', '', 2),
('(Nama belum diisi)', 'Kaur Keuangan', '', 3),
('(Nama belum diisi)', 'Kaur Perencanaan', '', 4);

INSERT INTO public.konten_religi (slug, judul, isi, urutan) VALUES
('sejarah', 'Kompleks Makam Aulia Sono', 'Kompleks Makam Aulia Sono terletak di Dusun Sono, Desa Sidokerto, Kecamatan Buduran, Kabupaten Sidoarjo. Kawasan ini merupakan kompleks ziarah yang menaungi lima makam ulama, termasuk pendiri Pondok Pesantren Sono, KH. Muhayyin. Kompleks ini menjadi tujuan peziarah dari dalam maupun luar Sidoarjo, terutama pada momen haul dan bulan-bulan tertentu.', 1),
('kh-muhayyin', 'Jejak KH. Muhayyin', 'KH. Muhayyin dikenal sebagai pendiri Pondok Pesantren Sono di Dusun Sono. Riwayat beliau menjadi bagian penting dari identitas keagamaan Desa Sidokerto. Uraian sejarah yang lebih lengkap akan ditambahkan setelah proses penelusuran arsip dan wawancara dengan pihak pesantren selesai.', 2),
('akses', 'Panduan & Rute Akses', 'Dari pusat Kota Sidoarjo, arahkan perjalanan menuju Kecamatan Buduran, kemudian lanjutkan ke Desa Sidokerto dan ikuti penunjuk arah menuju Dusun Sono. Bagi peziarah dari luar kota, titik masuk terdekat adalah pintu keluar tol wilayah Sidoarjo. Disarankan berkunjung pada pagi hingga sore hari. Rincian rute dan fasilitas parkir dapat diperbarui oleh perangkat desa.', 3);

INSERT INTO public.galeri (judul, keterangan, gambar_url, urutan) VALUES
('Kompleks Makam Aulia Sono', 'Ilustrasi kawasan ziarah di Dusun Sono.', '', 1),
('Serambi Kawasan Ziarah', 'Ilustrasi serambi dan area istirahat peziarah.', '', 2),
('Gerbang Kawasan Pesantren Sono', 'Ilustrasi akses masuk kawasan Dusun Sono.', '', 3);