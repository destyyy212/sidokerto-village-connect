import { Link } from "@tanstack/react-router";
import logoSidoarjo from "@/assets/logo-sidoarjo.svg";

const navItems = [
  { to: "/", label: "Beranda" },
  { to: "/religi", label: "Jelajah Religi" },
  { to: "/profil", label: "Pemerintahan" },
  { to: "/kontak", label: "Layanan" },
] as const;

export function SiteHeader() {
  return (
    <header className="relative z-20 px-4 pt-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl glass-panel px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoSidoarjo}
            alt="Lambang Kabupaten Sidoarjo"
            width={40}
            height={40}
            className="size-10 object-contain"
          />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-ink">Sidokerto Terpadu</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-brand/70">
              Kec. Buduran · Sidoarjo
            </p>
          </div>
        </Link>
        <div className="hidden items-center gap-1 text-sm font-medium text-ink/60 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-white/70 text-brand shadow-sm font-semibold" }}
              className="rounded-lg px-3 py-2 transition hover:bg-white/60"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          to="/admin"
          className="rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-md"
        >
          Masuk Admin
        </Link>
      </nav>
    </header>
  );
}
