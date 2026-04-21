import * as SliderPrimitive from "@radix-ui/react-slider";
import { Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { PANEL_WATTS, PANEL_WATT_OPTIONS, PEAK_SUN_HOURS } from "@/lib/calculator";

export type CalcSettings = {
  panelWatts: number;
  peakSunHours: number;
};

type Props = {
  settings: CalcSettings;
  onChange: (s: CalcSettings) => void;
};

export function SettingsPopover({ settings, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const isDefault =
    settings.panelWatts === PANEL_WATTS &&
    Math.abs(settings.peakSunHours - PEAK_SUN_HOURS) < 0.05;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Configuración de cálculo"
        title="Configuración"
        className={cn(
          "relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-200",
          open
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border bg-muted text-muted-foreground hover:border-primary/30 hover:text-foreground"
        )}
      >
        <Settings
          className={cn(
            "size-3.5 transition-transform duration-300",
            open && "rotate-90"
          )}
        />
        <span className="hidden sm:inline">Ajustes</span>
        {!isDefault && (
          <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-accent ring-2 ring-background" />
        )}
      </button>

      {open && (
        <div className="glass absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl p-4 shadow-xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Configuración del cálculo
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Panel watts */}
          <div className="mb-4">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Potencia del panel solar
            </label>
            <select
              value={settings.panelWatts}
              onChange={(e) =>
                onChange({ ...settings, panelWatts: Number(e.target.value) })
              }
              className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm font-semibold text-foreground transition-colors focus:border-primary/50 focus:outline-none"
            >
              {PANEL_WATT_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w} W{w === PANEL_WATTS ? " — estándar" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Peak sun hours */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Horas pico de sol / día
              </label>
              <span className="font-display text-xl font-bold tabular-nums text-primary">
                {settings.peakSunHours.toFixed(1)}
                <span className="ml-0.5 text-xs font-normal text-muted-foreground">h</span>
              </span>
            </div>

            <SliderPrimitive.Root
              value={[settings.peakSunHours]}
              min={1.0}
              max={8.0}
              step={0.1}
              onValueChange={([v]) =>
                onChange({ ...settings, peakSunHours: v ?? PEAK_SUN_HOURS })
              }
              className="relative flex h-8 w-full touch-none items-center"
            >
              <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted ring-1 ring-inset ring-black/5">
                <SliderPrimitive.Range className="absolute h-full rounded-full bg-[var(--gradient-charge)]" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb className="block size-4 rounded-full border-2 border-primary bg-background shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" />
            </SliderPrimitive.Root>

            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>1 h</span>
              <span className="font-semibold text-primary/80">
                PR defecto: {PEAK_SUN_HOURS} h
              </span>
              <span>8 h</span>
            </div>
          </div>

          {/* Info note */}
          <p className="mb-3 text-[10px] leading-relaxed text-muted-foreground">
            Cada panel de{" "}
            <strong className="text-foreground">{settings.panelWatts} W</strong> produce{" "}
            <strong className="text-primary">
              {((settings.panelWatts * settings.peakSunHours) / 1000).toFixed(2)} kWh/día
            </strong>{" "}
            con {settings.peakSunHours.toFixed(1)} h de sol.
          </p>

          {/* Reset */}
          {!isDefault && (
            <button
              type="button"
              onClick={() =>
                onChange({ panelWatts: PANEL_WATTS, peakSunHours: PEAK_SUN_HOURS })
              }
              className="w-full rounded-xl border border-dashed border-border py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              Restablecer valores por defecto
            </button>
          )}
        </div>
      )}
    </div>
  );
}
