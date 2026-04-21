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

  const lightVars: React.CSSProperties = {
    "--background":        "oklch(0.985 0.003 240)",
    "--foreground":        "oklch(0.18 0.02 260)",
    "--primary":           "oklch(0.38 0.16 265)",
    "--primary-foreground":"oklch(0.99 0 0)",
    "--accent":            "oklch(0.76 0.16 60)",
    "--accent-foreground": "oklch(0.18 0.02 260)",
    "--secondary":         "oklch(0.82 0.06 255)",
    "--secondary-foreground":"oklch(0.22 0.04 265)",
    "--muted":             "oklch(0.95 0.005 250)",
    "--muted-foreground":  "oklch(0.45 0.015 255)",
    "--wh-blue":           "oklch(0.38 0.16 265)",
    "--wh-yellow":         "oklch(0.76 0.16 60)",
    "--gradient-charge":   "linear-gradient(90deg,oklch(0.38 0.16 265),oklch(0.55 0.13 250),oklch(0.76 0.16 60))",
    "--shadow-glow-primary":"0 0 24px oklch(0.38 0.16 265 / 25%)",
    "--shadow-glow-accent": "0 0 18px oklch(0.76 0.16 60 / 35%)",
  } as React.CSSProperties;

  return (
    <div
      style={lightVars}
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
        <div className="flex flex-col items-center gap-2">
          {/* Track */}
          <div
            className="relative h-4 w-64 overflow-hidden rounded-full sm:w-80"
            style={{
              background: "oklch(0.91 0.01 250)",
              boxShadow: "inset 0 2px 5px oklch(0 0 0 / 18%)",
            }}
          >
            {/* Fill */}
            <div
              className="splash-bar absolute inset-y-0 left-0 rounded-full bg-[var(--gradient-charge)]"
              style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 30%)" }}
            >
              <span className="charge-shimmer-fast pointer-events-none absolute inset-0 rounded-full" />
            </div>
            {/* Segment ticks */}
            {[25, 50, 75].map((p) => (
              <div
                key={p}
                className="pointer-events-none absolute inset-y-1.5 w-px bg-black/10"
                style={{ left: `${p}%` }}
              />
            ))}
          </div>
          {/* Glow beneath bar */}
          <div
            className="splash-bar-glow pointer-events-none -mt-6 h-3 w-56 rounded-full blur-lg sm:w-72"
            style={{
              background:
                "linear-gradient(90deg,oklch(0.38 0.16 265/50%),oklch(0.76 0.16 60/60%))",
            }}
          />
          <p
            className="splash-charging-label text-[10px] font-bold uppercase tracking-[0.35em]"
            style={{ color: "oklch(0.45 0.015 255)" }}
          >
            Cargando…
          </p>
        </div>
      </div>
    </div>
  );
}
