import { Battery, CarFront } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAR_MODELS, type CarModel } from "@/lib/calculator";

type CarSelectorProps = {
  selectedId: string;
  onSelect: (car: CarModel) => void;
};

export function CarSelector({ selectedId, onSelect }: CarSelectorProps) {
  const selected = CAR_MODELS.find((c) => c.id === selectedId);

  return (
    <div className="space-y-3">
      <Select
        value={selectedId || undefined}
        onValueChange={(id) => {
          const car = CAR_MODELS.find((c) => c.id === id);
          if (car) onSelect(car);
        }}
      >
        <SelectTrigger className="h-14 w-full rounded-2xl border-border bg-card/40 px-4 text-left">
          <SelectValue placeholder="Seleccione un modelo de carro…" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {CAR_MODELS.map((car) => (
            <SelectItem key={car.id} value={car.id}>
              <span className="flex w-full items-center justify-between gap-4">
                <span className="truncate">
                  <span className="text-muted-foreground">{car.brand}</span>{" "}
                  <span className="font-medium">{car.name}</span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {car.milesPerKwh.toFixed(1)} mi/kWh
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!selected ? (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/20 px-4 py-3 text-muted-foreground">
          <CarFront className="size-5 text-primary" strokeWidth={2} />
          <p className="text-xs leading-relaxed">
            Seleccione un modelo de carro para continuar y calcular sus paneles.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <Battery className="size-5 text-primary" strokeWidth={2} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {selected.brand}
              </p>
              <p className="font-display text-sm font-semibold text-foreground">
                {selected.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-lg font-bold tabular-nums text-primary">
              {selected.milesPerKwh.toFixed(1)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              mi / kWh
            </p>
          </div>
        </div>
      )}

      {selected?.id === "otros" && (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-[11px] leading-relaxed text-foreground">
          Estimado estándar de la industria (3.5 mi/kWh) para vehículos no
          listados.
        </p>
      )}
    </div>
  );
}
