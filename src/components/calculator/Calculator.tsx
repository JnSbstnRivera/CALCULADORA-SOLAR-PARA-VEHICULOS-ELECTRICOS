import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import logoUrl from "@/assets/windmar-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  CAR_MODELS,
  MI_TO_KM,
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
};

const STORAGE_KEY = "ev-panels-calculator-v1";

const defaults: Stored = {
  milesPerDay: 0,
  carId: "",
  unit: "mi",
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
    if (!car) return { kwhPerDay: 0, kwhPerMonth: 0, kwhPerYear: 0, panelsNeeded: 0 };
    const input: CalculatorInput = {
      milesPerDay: state.milesPerDay,
      milesPerKwh: car.milesPerKwh,
    };
    return calculate(input);
  }, [state, car]);

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
        <header className="mb-6 flex flex-col items-center gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5 sm:text-left">
            <img
              src={logoUrl}
              alt="Windmar Home"
              className="h-16 w-auto shrink-0 sm:h-24 lg:h-28"
              loading="eager"
            />
            <div className="text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-primary sm:text-3xl lg:text-4xl">
                Calculadora Solar{" "}
                <span className="block text-foreground sm:inline">
                  para Vehículos Eléctricos
                </span>
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
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
                  {/* Reset */}
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Reiniciar calculadora"
                    title="Reiniciar"
                    className="rounded-full p-1.5 text-muted-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
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
            />
          </div>
        </div>
      </div>
    </section>
  );
}
