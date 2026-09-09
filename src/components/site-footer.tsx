export function SiteFooter() {
  return (
    <footer className="relative z-10 px-4 pb-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 rounded-2xl glass-panel px-6 py-6 text-sm text-ink/60 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display font-semibold text-ink">Desa Sidokerto</p>
          <p className="text-xs">Kec. Buduran · Kab. Sidoarjo · Jawa Timur</p>
        </div>
        <p className="text-xs">Sistem Informasi Desa Terpadu · Konten dikelola perangkat desa</p>
      </div>
    </footer>
  );
}
