import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Zap, TrendingDown, ShieldCheck } from "lucide-react";

import logoUrl from "@/assets/windmar-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SettingsPopover, type CalcSettings } from "@/components/SettingsPopover";
import {
  CAR_MODELS,
  MI_TO_KM,
  PANEL_WATTS,
  PEAK_SUN_HOURS,
  calculate,
  type CalculatorInput,
  type CarModel,
  type DistanceUnit,
} from "@/lib/calculator";
import { CarSelector } from "./CarSelector";
import { ResultPanel } from "./ResultPanel";
import { RoadSlider } from "./RoadSlider";

type Stored = {
  milesPerDay: number;
  carId: string;
  unit: DistanceUnit;
  panelWatts: number;
  peakSunHours: number;
};

const STORAGE_KEY = "ev-panels-calculator-v1";

const defaults: Stored = {
  milesPerDay: 0,
  carId: "",
  unit: "mi",
  panelWatts: PANEL_WATTS,
  peakSunHours: PEAK_SUN_HOURS,
};

function loadStored(): Stored {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    return { ...defaults, ...parsed, milesPerDay: 0 };
  } catch {
    return defaults;
  }
}

export function Calculator() {
  const [state, setState] = useState<Stored>(defaults);

  useEffect(() => {
    setState(loadStored());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state]);

  const car: CarModel | undefined = CAR_MODELS.find((c) => c.id === state.carId);

  const result = useMemo(() => {
    const panelKwhPerDay = (state.panelWatts * state.peakSunHours) / 1000;
    if (!car) return { kwhPerDay: 0, kwhPerMonth: 0, kwhPerYear: 0, panelsNeeded: 0, panelKwhPerDay };
    const input: CalculatorInput = {
      milesPerDay: state.milesPerDay,
      milesPerKwh: car.milesPerKwh,
      panelWatts: state.panelWatts,
      peakSunHours: state.peakSunHours,
    };
    return calculate(input);
  }, [state, car]);

  const settings: CalcSettings = {
    panelWatts: state.panelWatts,
    peakSunHours: state.peakSunHours,
  };

  const handleReset = () => {
    setState(defaults);
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    }
  };

  const displayDistance =
    state.unit === "km"
      ? Math.round(state.milesPerDay * MI_TO_KM)
      : state.milesPerDay;

  return (
    <section className="relative px-3 pb-10 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:px-8 lg:pt-8">
      <div className="mx-auto max-w-5xl">

        {/* ── Header ── */}
        <header className="mb-6 sm:mb-8">
          {/* Barra acento naranja */}
          <div className="h-1 w-3/5 rounded-full bg-accent mb-4" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Logo + Título */}
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-xl p-2.5 shadow-lg border border-border shrink-0 hover:scale-105 transition-transform">
                <img
                  src={logoUrl}
                  alt="Windmar Home"
                  className="h-12 w-auto sm:h-14"
                  loading="eager"
                />
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold uppercase leading-tight tracking-tight text-primary">
                  Calculadora Solar{" "}
                  <span className="block text-foreground sm:inline text-lg sm:text-xl lg:text-2xl">
                    para Vehículos Eléctricos
                  </span>
                </h1>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium tracking-wide">
                  Windmar Home • Puerto Rico
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reiniciar calculadora"
                title="Reiniciar"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors"
              >
                <RotateCcw className="size-3.5" />
                Reiniciar
              </button>
              <SettingsPopover
                settings={settings}
                onChange={(s) => setState((prev) => ({ ...prev, ...s }))}
              />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="glass space-y-6 rounded-3xl p-4 sm:space-y-8 sm:p-6 lg:p-8">

            {/* PASO 1 — Modelo de carro */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground sm:text-sm">
                Modelo de carro eléctrico
              </label>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground sm:mb-4">
                Seleccione el modelo. Si no aparece, use{" "}
                <span className="font-semibold text-foreground">"Otros"</span>{" "}
                para un estimado estándar de la industria.
              </p>
              <CarSelector
                selectedId={state.carId}
                onSelect={(c) => setState((s) => ({ ...s, carId: c.id }))}
              />
            </div>

            {/* PASO 2 — Distancia por día */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground sm:text-sm">
                  Distancia por día
                </label>
                <div className="flex items-center gap-2">
                  {/* Unit toggle */}
                  <div className="flex rounded-full border border-border bg-muted p-0.5 text-[11px] font-bold">
                    {(["mi", "km"] as DistanceUnit[]).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setState((s) => ({ ...s, unit: u }))}
                        className={`rounded-full px-2.5 py-1 uppercase tracking-wider transition-all duration-200 ${
                          state.unit === u
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                  {/* Display value */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
                      {displayDistance}
                    </span>
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {state.unit}/día
                    </span>
                  </div>
                </div>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground sm:mb-4">
                Arrastre el logo sobre la carretera o pulse una parada para
                indicar el recorrido diario promedio.
              </p>
              <RoadSlider
                value={state.milesPerDay}
                unit={state.unit}
                onValueChange={(v) => setState((s) => ({ ...s, milesPerDay: v }))}
              />
            </div>
          </div>

          <div className="lg:sticky lg:top-4">
            <ResultPanel
              result={result}
              car={car}
              milesPerDay={state.milesPerDay}
              unit={state.unit}
              panelWatts={state.panelWatts}
              peakSunHours={state.peakSunHours}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
          <div className="flex gap-4">
            <div className="bg-accent/10 p-3 rounded-xl h-fit shrink-0">
              <Zap className="text-accent" size={22} />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm mb-1">Carga Solar 100% Limpia</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Nuestros paneles de alta eficiencia convierten la luz del sol en la energía exacta que necesita tu vehículo eléctrico cada día.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-primary/10 p-3 rounded-xl h-fit shrink-0">
              <TrendingDown className="text-primary" size={22} />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm mb-1">Ahorro Real en Combustible</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Elimina el costo mensual de cargar tu EV. Calcula cuántos paneles necesitas según tu recorrido diario y deja de pagar por gasolina.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-primary/10 p-3 rounded-xl h-fit shrink-0">
              <ShieldCheck className="text-primary" size={22} />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm mb-1">Instalación Certificada</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Técnicos certificados en Puerto Rico. Instalación profesional, garantía de fabricante y soporte al cliente disponible 24/7.
              </p>
            </div>
          </div>
        </footer>

        {/* Copyright */}
        <div className="text-center pt-6 pb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
            © 2026 Windmar Home • Todos los derechos reservados
          </p>
        </div>

      </div>
    </section>
  );
}
