import { CarFront, Sun, Zap } from "lucide-react";

import { useCountUp } from "@/hooks/use-count-up";
import {
  MI_TO_KM,
  PANEL_WATTS,
  PEAK_SUN_HOURS,
  formatNumber,
  type CalculatorResult,
  type CarModel,
  type DistanceUnit,
} from "@/lib/calculator";
import { SolarPanelIcon } from "./SolarPanelIcon";

type ResultPanelProps = {
  result: CalculatorResult;
  car: CarModel | undefined;
  milesPerDay: number;
  unit?: DistanceUnit;
  panelWatts?: number;
  peakSunHours?: number;
};

export function ResultPanel({
  result,
  car,
  milesPerDay,
  unit = "mi",
  panelWatts = PANEL_WATTS,
  peakSunHours = PEAK_SUN_HOURS,
}: ResultPanelProps) {
  const displayDistance =
    unit === "km" ? Math.round(milesPerDay * MI_TO_KM) : milesPerDay;
  const unitLabel = unit === "km" ? "km" : "millas";
  const panelKwhPerDay = result.panelKwhPerDay ?? (panelWatts * peakSunHours) / 1000;
  const panels = useCountUp(result.panelsNeeded);
  const kwhDay = useCountUp(result.kwhPerDay, 600);
  const hasCar = Boolean(car);

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-4 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--gradient-charge)]" />

      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex size-2 rounded-full bg-accent shadow-[0_0_10px_oklch(0.76_0.16_60/70%)]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Paneles solares requeridos
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-secondary/20 to-accent/10 p-4 text-center sm:p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 size-32 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative flex items-center justify-center gap-4">
          <div className="inline-flex h-14 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 p-1 ring-1 ring-primary/25">
            <SolarPanelIcon className="h-full w-full text-primary drop-shadow-[0_2px_8px_oklch(0.38_0.16_265/30%)]" />
          </div>
          <div className="text-left">
            <p className="font-display text-5xl font-extrabold tabular-nums leading-none text-primary sm:text-6xl">
              {Math.round(panels)}
            </p>
            <p className="mt-1.5 text-[11px] font-medium text-muted-foreground sm:text-xs">
              panel{Math.round(panels) === 1 ? "" : "es"} de{" "}
              <span className="font-semibold text-foreground">
                {PANEL_WATTS} W
              </span>
            </p>
          </div>
        </div>
      </div>

      {!hasCar ? (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-border bg-secondary/20 p-4">
          <CarFront className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={2} />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">
              Seleccione un modelo de carro
            </span>{" "}
            para ver cuántos paneles cubren su consumo y por qué.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Stat
              icon={<Zap className="size-4" />}
              label="Consumo diario"
              value={`${formatNumber(kwhDay, 1)} kWh`}
            />
            <Stat
              icon={<Sun className="size-4" />}
              label="Por panel / día"
              value={`${formatNumber(panelKwhPerDay, 2)} kWh`}
            />
          </div>

          {/* Resumen simple para el cliente */}
          <div className="mt-4 space-y-2.5 rounded-2xl border border-border bg-card/40 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Resumen para el cliente
            </p>
            <ul className="space-y-2 text-xs leading-relaxed text-foreground">
              <li className="flex gap-2">
                <span className="text-primary">🚗</span>
                <span>
                  Su carro gasta{" "}
                  <strong>{formatNumber(kwhDay, 1)} kWh al día</strong>{" "}
                  manejando {displayDistance} {unitLabel}.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">☀️</span>
                <span>
                  Cada panel le da{" "}
                  <strong>{formatNumber(PANEL_KWH_PER_DAY, 2)} kWh al día</strong>{" "}
                  con sol normal.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✅</span>
                <span>
                  Por eso con{" "}
                  <strong className="text-primary">
                    {result.panelsNeeded} panel
                    {result.panelsNeeded === 1 ? "" : "es"}
                  </strong>{" "}
                  cubre todo el gasto de su carro eléctrico.
                </span>
              </li>
            </ul>
          </div>
        </>
      )}

      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
        Estimación basada en{" "}
        <span className="font-semibold text-foreground">{peakSunHours.toFixed(1)} h</span> de sol
        y paneles de{" "}
        <span className="font-semibold text-foreground">{panelWatts} W</span> al día.
      </p>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-4">
      <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
        {icon}
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display text-xl font-bold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}
