import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50 via-teal-50/40 to-white" />
      <div className="pointer-events-none absolute -top-40 -left-32 size-[420px] rounded-full bg-sky-300/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 size-[380px] rounded-full bg-teal-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 size-[360px] rounded-full bg-cyan-200/30 blur-3xl" />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
