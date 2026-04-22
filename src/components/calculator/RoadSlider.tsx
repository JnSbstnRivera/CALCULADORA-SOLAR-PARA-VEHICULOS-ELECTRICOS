import * as SliderPrimitive from "@radix-ui/react-slider";
import { useState } from "react";

import truckUrl from "@/assets/windmar-truck.png";
import { cn } from "@/lib/utils";
import { MAX_MILES, MI_TO_KM, MIN_MILES, ROAD_STOPS, type DistanceUnit } from "@/lib/calculator";

type RoadSliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  unit?: DistanceUnit;
  className?: string;
};

/**
 * Straight-road slider with an inset "charge bar" fill.
 * Mileage stops sit above the road; click one to jump, drag the thumb to fine-tune.
 */
export function RoadSlider({ value, onValueChange, unit = "mi", className }: RoadSliderProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const pct = (n: number) =>
    ((n - MIN_MILES) / (MAX_MILES - MIN_MILES)) * 100;

  const stopLabel = (stop: number) =>
    unit === "km" ? Math.round(stop * MI_TO_KM) : stop;
  const unitLabel = unit === "km" ? "Km" : "Millas";

  return (
    <div className={cn("w-full select-none", className)}>
      {/* Mileage waypoints above the road */}
      <div className="relative mb-3 h-14">
        {/* Animated connecting line behind the circles */}
        <div
          className="pointer-events-none absolute top-[22px] h-[4px] -translate-y-1/2 overflow-hidden rounded-full bg-primary/70"
          style={{
            left: `${pct(ROAD_STOPS[0])}%`,
            right: `${100 - pct(ROAD_STOPS[ROAD_STOPS.length - 1])}%`,
          }}
        >
          {/* Filled progress segment up to the current value */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--gradient-charge)] transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  ((value - ROAD_STOPS[0]) /
                    (ROAD_STOPS[ROAD_STOPS.length - 1] - ROAD_STOPS[0])) *
                    100,
                ),
              )}%`,
            }}
          >
            <span className="charge-shimmer pointer-events-none absolute inset-0 rounded-full" />
          </div>
        </div>

        {ROAD_STOPS.map((stop) => {
          const left = pct(stop);
          const isActive = Math.abs(value - stop) < 3;
          const isHover = hovered === stop;
          return (
            <button
              key={stop}
              type="button"
              aria-label={`Set to ${stop} miles per day`}
              onClick={() => onValueChange(stop)}
              onMouseEnter={() => setHovered(stop)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(stop)}
              onBlur={() => setHovered(null)}
              className="group absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1 transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:scale-105"
              style={{ left: `${left}%` }}
            >
              <span
                className={cn(
                  "relative z-10 flex size-11 flex-col items-center justify-center rounded-full border-2 text-center transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow-primary)]"
                    : isHover
                      ? "border-primary bg-card text-primary"
                      : "border-border bg-card text-foreground"
                )}
              >
                <span className="font-display text-xs font-bold leading-none tabular-nums">
                  {stopLabel(stop)}
                </span>
                <span
                  className={cn(
                    "mt-0.5 text-[7px] font-semibold uppercase leading-none tracking-wide",
                    isActive ? "opacity-90" : "opacity-70"
                  )}
                >
                  {unitLabel}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Straight road with embedded charge bar */}
      <SliderPrimitive.Root
        className="relative flex h-12 w-full touch-none items-center"
        value={[value]}
        min={MIN_MILES}
        max={MAX_MILES}
        step={1}
        onValueChange={(v) => onValueChange(v[0] ?? MIN_MILES)}
      >
        {/* Road / track: dark asphalt with inset charge bar */}
        <SliderPrimitive.Track
          className={cn(
            "relative h-10 w-full grow overflow-hidden rounded-full",
            "bg-[oklch(0.22_0.01_260)]",
            "ring-1 ring-inset ring-[oklch(0_0_0/12%)]",
            "shadow-[inset_0_2px_6px_oklch(0_0_0/35%)]"
          )}
        >
          {/* Center dashed lane line */}
          <div
            className="pointer-events-none absolute inset-x-3 top-1/2 h-[2px] -translate-y-1/2 opacity-80"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(1 0 0 / 70%) 50%, transparent 50%)",
              backgroundSize: "16px 2px",
              backgroundRepeat: "repeat-x",
            }}
          />

          {/* Charge fill — inset bar with gradient + shimmer */}
          <SliderPrimitive.Range
            className={cn(
              "absolute inset-y-1.5 left-1.5 rounded-full",
              "bg-[var(--gradient-charge)]",
              "shadow-[0_0_18px_oklch(0.38_0.16_265/45%),inset_0_1px_0_oklch(1_0_0/30%)]"
            )}
          >
            <span className="charge-shimmer pointer-events-none absolute inset-0 rounded-full" />
          </SliderPrimitive.Range>
        </SliderPrimitive.Track>

        {/* Thumb — Windmar truck as the moving marker */}
        <SliderPrimitive.Thumb
          aria-label="Miles per day"
          className={cn(
            "block h-16 w-32 cursor-grab",
            "transition-transform duration-150 hover:scale-110 active:scale-95 active:cursor-grabbing",
            "focus:outline-none focus-visible:scale-110"
          )}
        >
          <div className="relative h-full w-full">
            {/* Glow halo behind the truck */}
            <div
              className="pointer-events-none absolute inset-x-2 inset-y-1 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 60%, #1D429B 0%, rgba(29,66,155,0.55) 45%, transparent 75%)",
              }}
            />
            {/* Truck image with combined CSS filter */}
            <img
              src={truckUrl}
              alt=""
              draggable={false}
              className="pointer-events-none relative h-full w-full object-contain"
              style={{
                filter:
                  "drop-shadow(0 0 6px #1D429B) " +
                  "drop-shadow(0 0 16px rgba(29,66,155,0.85)) " +
                  "drop-shadow(0 0 32px rgba(29,66,155,0.55)) " +
                  "drop-shadow(0 5px 10px rgba(0,0,0,0.5)) " +
                  "brightness(1.12) saturate(1.25) contrast(1.05)",
              }}
            />
          </div>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </div>
  );
}
