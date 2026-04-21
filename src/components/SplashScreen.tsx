import { useEffect, useState } from "react";
import { Car, Sun, Zap } from "lucide-react";

import logoUrl from "@/assets/windmar-logo.png";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer   = window.setTimeout(() => setFadeOut(true), 4000);
    const removeTimer = window.setTimeout(() => setVisible(false), 4600);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background ${
        fadeOut ? "splash-fade-out" : ""
      }`}
      aria-hidden="true"
    >
      {/* Background halos */}
      <div className="splash-halo-blue absolute -left-32 top-1/4 size-[420px] rounded-full bg-primary/20 blur-3xl" />
      <div className="splash-halo-yellow absolute -right-32 bottom-1/4 size-[420px] rounded-full bg-accent/25 blur-3xl" />

      {/* Animated road lines */}
      <div className="absolute left-0 right-0 top-[48%] h-[2px] -translate-y-1/2 overflow-hidden">
        <div className="splash-road h-full w-full bg-[linear-gradient(90deg,transparent,var(--wh-blue)_30%,var(--wh-yellow)_70%,transparent)]" />
      </div>
      <div className="absolute left-0 right-0 top-[52%] h-[2px] -translate-y-1/2 overflow-hidden">
        <div className="splash-road-2 h-full w-full bg-[linear-gradient(90deg,transparent,var(--wh-yellow)_30%,var(--wh-blue)_70%,transparent)]" />
      </div>

      <div className="relative flex flex-col items-center gap-10 px-6">
        {/* Floating icons orbiting around the logo */}
        <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
          {/* Pulsing ring */}
          <div className="splash-ring absolute inset-0 rounded-full border-2 border-primary/30" />
          <div
            className="splash-ring absolute inset-0 rounded-full border-2 border-accent/40"
            style={{ animationDelay: "0.4s" }}
          />

          {/* Sun — top */}
          <div
            className="splash-orbit absolute -top-2 left-1/2 -translate-x-1/2"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-glow-accent)]">
              <Sun className="size-6" strokeWidth={2.5} />
            </div>
          </div>

          {/* Car — bottom-left */}
          <div
            className="splash-orbit absolute -bottom-1 left-0"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow-primary)]">
              <Car className="size-6" strokeWidth={2.5} />
            </div>
          </div>

          {/* Zap — bottom-right */}
          <div
            className="splash-orbit absolute -bottom-1 right-0"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary shadow-[var(--shadow-glow-primary)]">
              <Zap className="size-6" strokeWidth={2.5} />
            </div>
          </div>

          {/* Logo center */}
          <div className="splash-logo relative z-10">
            <img
              src={logoUrl}
              alt="Windmar Home"
              className="h-28 w-auto sm:h-32"
              loading="eager"
            />
          </div>
        </div>

        {/* Title reveal */}
        <div className="text-center">
          <p className="splash-title font-display text-2xl font-bold uppercase tracking-tight text-primary sm:text-3xl">
            Calculadora Solar
          </p>
          <p className="splash-subtitle mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:text-sm">
            para Vehículos Eléctricos
          </p>
        </div>

        {/* Charge bar */}
        <div className="relative h-2 w-56 overflow-hidden rounded-full bg-muted sm:w-72">
          <div className="splash-bar absolute inset-y-0 left-0 rounded-full bg-[var(--gradient-charge)]">
            <span className="charge-shimmer pointer-events-none absolute inset-0 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
