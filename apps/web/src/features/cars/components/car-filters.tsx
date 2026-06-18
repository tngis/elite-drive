"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  allCategories,
  allFuels,
  allTransmissions,
  formatPrice,
  priceBounds,
} from "../data";
import type { CarCategory, FuelType, Transmission } from "../types";

export interface CarFilterState {
  categories: CarCategory[];
  transmissions: Transmission[];
  fuels: FuelType[];
  maxPrice: number;
}

export const emptyFilters: CarFilterState = {
  categories: [],
  transmissions: [],
  fuels: [],
  maxPrice: priceBounds.max,
};

type Group = "categories" | "transmissions" | "fuels";

export function CarFilters({
  value,
  onChange,
}: {
  value: CarFilterState;
  onChange: (next: CarFilterState) => void;
}) {
  function toggle<T extends string>(group: Group, item: T) {
    const list = value[group] as T[];
    const next = list.includes(item)
      ? list.filter((x) => x !== item)
      : [...list, item];
    onChange({ ...value, [group]: next });
  }

  return (
    <div className="space-y-6">
      <FilterSection title="Ангилал">
        {allCategories.map((c) => (
          <CheckRow
            key={c}
            label={c}
            checked={value.categories.includes(c)}
            onToggle={() => toggle("categories", c)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Хурдны хайрцаг">
        {allTransmissions.map((t) => (
          <CheckRow
            key={t}
            label={t}
            checked={value.transmissions.includes(t)}
            onToggle={() => toggle("transmissions", t)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Шатахуун">
        {allFuels.map((f) => (
          <CheckRow
            key={f}
            label={f}
            checked={value.fuels.includes(f)}
            onToggle={() => toggle("fuels", f)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Үнэ (өдөрт хүртэл)">
        <Slider
          min={priceBounds.min}
          max={priceBounds.max}
          step={5000}
          value={[value.maxPrice]}
          onValueChange={([v]) => onChange({ ...value, maxPrice: v })}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {formatPrice(value.maxPrice)} хүртэл
        </p>
      </FilterSection>

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => onChange(emptyFilters)}
      >
        Шүүлтүүр цэвэрлэх
      </Button>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <span>{label}</span>
    </label>
  );
}
