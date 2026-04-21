// Pure calculator logic: how many 410 Wh solar panels cover an EV's electricity.

export type CarModel = {
  id: string;
  brand: string;
  name: string;
  /** Efficiency in miles per kWh. */
  milesPerKwh: number;
};

/**
 * Popular EV efficiency reference (miles per kWh).
 * "Otros" uses an industry-standard average for unlisted vehicles.
 */
export const CAR_MODELS: CarModel[] = [
  { id: "tesla-model-3-sr", brand: "Tesla", name: "Model 3 Standard Range", milesPerKwh: 4.2 },
  { id: "tesla-model-s-lr", brand: "Tesla", name: "Model S Long Range", milesPerKwh: 3.6 },
  { id: "tesla-model-y-lr", brand: "Tesla", name: "Model Y Long Range", milesPerKwh: 3.9 },
  { id: "tesla-model-x-lr", brand: "Tesla", name: "Model X Long Range", milesPerKwh: 2.9 },
  { id: "volvo-xc40-recharge", brand: "Volvo", name: "XC40 Recharge", milesPerKwh: 3.7 },
  { id: "chevy-bolt-ev", brand: "Chevrolet", name: "Bolt EV", milesPerKwh: 3.6 },
  { id: "nissan-leaf-s", brand: "Nissan", name: "Leaf S", milesPerKwh: 3.3 },
  { id: "bmw-i3", brand: "BMW", name: "i3", milesPerKwh: 3.5 },
  { id: "hyundai-kona-electric", brand: "Hyundai", name: "Kona Electric", milesPerKwh: 3.9 },
  { id: "kia-e-niro", brand: "Kia", name: "e-Niro", milesPerKwh: 3.9 },
  { id: "vw-id4", brand: "Volkswagen", name: "ID.4", milesPerKwh: 3.3 },
  { id: "ford-mustang-mach-e", brand: "Ford", name: "Mustang Mach-E", milesPerKwh: 3.5 },
  { id: "audi-e-tron", brand: "Audi", name: "e-tron", milesPerKwh: 3.0 },
  { id: "otros", brand: "Otros", name: "Estimado estándar", milesPerKwh: 3.5 },
];

/** Solar panel output: 410 W per panel × peak sun hours per day. */
export const PANEL_WATTS = 410;
export const PEAK_SUN_HOURS = 4.2;
/** Daily kWh produced by one 410 W panel (≈ 1.72 kWh/day). */
export const PANEL_KWH_PER_DAY = (PANEL_WATTS * PEAK_SUN_HOURS) / 1000;

export type CalculatorInput = {
  milesPerDay: number;
  milesPerKwh: number;
};

export type CalculatorResult = {
  kwhPerDay: number;
  kwhPerMonth: number;
  kwhPerYear: number;
  panelsNeeded: number;
};

export function calculate(input: CalculatorInput): CalculatorResult {
  const miles = Math.max(0, input.milesPerDay);
  const kwhPerDay = miles / Math.max(0.1, input.milesPerKwh);
  const panelsNeeded = Math.ceil(kwhPerDay / PANEL_KWH_PER_DAY);
  return {
    kwhPerDay,
    kwhPerMonth: kwhPerDay * 30,
    kwhPerYear: kwhPerDay * 365,
    panelsNeeded: Number.isFinite(panelsNeeded) ? panelsNeeded : 0,
  };
}

export function formatNumber(n: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(n);
}

/** Mileage stops shown on the road slider. */
export const ROAD_STOPS = [10, 20, 30, 40, 50] as const;
export const MIN_MILES = 5;
export const MAX_MILES = 60;
