CREATE TABLE public.statistik_penduduk (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kategori text NOT NULL,
  label text NOT NULL,
  jumlah integer NOT NULL DEFAULT 0,
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.statistik_penduduk TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.statistik_penduduk TO authenticated;
GRANT ALL ON public.statistik_penduduk TO service_role;
ALTER TABLE public.statistik_penduduk ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Statistik dapat dilihat semua orang" ON public.statistik_penduduk FOR SELECT USING (true);
CREATE POLICY "Admin mengelola statistik" ON public.statistik_penduduk FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_statistik_updated BEFORE UPDATE ON public.statistik_penduduk
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.statistik_penduduk (kategori, label, jumlah, urutan) VALUES
('jenis_kelamin','Laki-laki',0,1),
('jenis_kelamin','Perempuan',0,2),
('usia','0-14 tahun',0,1),
('usia','15-24 tahun',0,2),
('usia','25-44 tahun',0,3),
('usia','45-64 tahun',0,4),
('usia','65+ tahun',0,5),
('pendidikan','SD/Sederajat',0,1),
('pendidikan','SMP/Sederajat',0,2),
('pendidikan','SMA/Sederajat',0,3),
('pendidikan','Diploma/Sarjana',0,4),
('pekerjaan','Petani',0,1),
('pekerjaan','Buruh/Karyawan',0,2),
('pekerjaan','Wiraswasta',0,3),
('pekerjaan','PNS/TNI/Polri',0,4),
('pekerjaan','Lainnya',0,5);