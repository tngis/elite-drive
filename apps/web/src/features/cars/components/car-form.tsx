"use client";

import { useState } from "react";
import { useForm, Controller, type Control, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { carInputSchema, type CarInput, type CarDto } from "@elite-drive/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/features/auth/components/field";
import { ImagePickerLocal } from "./image-picker-local";
import { allCategories, allFuels, allTransmissions } from "../data";
import { ApiError } from "@/lib/api-client";

export function CarForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: CarDto;
  submitLabel: string;
  onSubmit: (data: CarInput, images: File[]) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CarInput>({
    // zod .default() нь input/output төрлийг зөрүүлдэг тул resolver-г cast хийв
    resolver: zodResolver(carInputSchema) as Resolver<CarInput>,
    defaultValues: initial
      ? {
          brand: initial.brand,
          name: initial.name,
          year: initial.year,
          plateNumber: initial.plateNumber,
          color: initial.color,
          category: initial.category as CarInput["category"],
          transmission: initial.transmission as CarInput["transmission"],
          fuel: initial.fuel as CarInput["fuel"],
          seats: initial.seats,
          pricePerDay: initial.pricePerDay,
          deposit: initial.deposit,
          location: initial.location,
          description: initial.description ?? "",
          features: initial.features,
        }
      : {
          category: "Сэдан",
          transmission: "Автомат",
          fuel: "Бензин",
          seats: 5,
          deposit: 0,
          features: [],
          year: new Date().getFullYear(),
        },
  });

  const [featuresText, setFeaturesText] = useState(
    initial?.features.join(", ") ?? "",
  );
  const [images, setImages] = useState<File[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const isCreate = !initial;

  async function submit(data: CarInput) {
    setServerError(null);
    const features = featuresText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await onSubmit({ ...data, features }, images);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Алдаа гарлаа");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      {isCreate && (
        <div className="space-y-1.5">
          <Label>Зураг</Label>
          <ImagePickerLocal files={images} onChange={setImages} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Марк" placeholder="Toyota" error={errors.brand?.message} {...register("brand")} />
        <Field label="Модель" placeholder="Land Cruiser 200" error={errors.name?.message} {...register("name")} />
        <Field
          label="Үйлдвэрлэсэн он"
          type="number"
          error={errors.year?.message}
          {...register("year", { valueAsNumber: true })}
        />
        <Field label="Улсын дугаар" placeholder="1234 УБА" error={errors.plateNumber?.message} {...register("plateNumber")} />
        <Field label="Өнгө" placeholder="Хар" error={errors.color?.message} {...register("color")} />
        <Field
          label="Суудлын тоо"
          type="number"
          error={errors.seats?.message}
          {...register("seats", { valueAsNumber: true })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField name="category" label="Ангилал" control={control} options={allCategories} />
        <SelectField name="transmission" label="Хурдны хайрцаг" control={control} options={allTransmissions} />
        <SelectField name="fuel" label="Шатахуун" control={control} options={allFuels} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Өдрийн үнэ (₮)"
          type="number"
          placeholder="150000"
          error={errors.pricePerDay?.message}
          {...register("pricePerDay", { valueAsNumber: true })}
        />
        <Field
          label="Барьцаа (₮)"
          type="number"
          placeholder="300000"
          error={errors.deposit?.message}
          {...register("deposit", { valueAsNumber: true })}
        />
      </div>

      <Field label="Байршил" placeholder="Улаанбаатар, СБД" error={errors.location?.message} {...register("location")} />

      <Field
        name="features"
        label="Тоноглол (таслалаар тусгаарлана)"
        placeholder="4WD, Камер, Sunroof"
        value={featuresText}
        onChange={(e) => setFeaturesText(e.target.value)}
      />

      <div className="space-y-1.5">
        <Label htmlFor="description">Тайлбар</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Машины онцлог, нөхцөл байдал..."
          {...register("description")}
        />
      </div>

      {serverError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}

function SelectField({
  name,
  label,
  control,
  options,
}: {
  name: "category" | "transmission" | "fuel";
  label: string;
  control: Control<CarInput>;
  options: readonly string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
