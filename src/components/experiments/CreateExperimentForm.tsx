"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Variant } from "@/lib/types";

export function CreateExperimentForm({
  variants,
  onSubmit
}: {
  variants: Variant[];
  onSubmit: (data: {
    variant_ids: string[];
    confidence_level: number;
    target_sample_size: number;
    duration_hours: number;
    traffic_split?: Record<string, number> | null;
  }) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0.95);
  const [sampleSize, setSampleSize] = useState(1000);
  const [duration, setDuration] = useState(72);
  const [manualSplit, setManualSplit] = useState(false);
  const [split, setSplit] = useState<Record<string, number>>({});

  const selectedVariants = useMemo(
    () => variants.filter((variant) => selected.includes(variant.id)),
    [variants, selected]
  );

  const toggleVariant = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const updateSplit = (id: string, value: number) => {
    setSplit((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Card className="space-y-4 p-6">
      <h3 className="font-display text-lg">Create Experiment</h3>
      <div className="space-y-2">
        <p className="text-sm text-sand-700">Select Variants</p>
        <div className="space-y-2">
          {variants.map((variant) => (
            <label key={variant.id} className="flex items-center gap-2 text-sm text-sand-700">
              <input
                type="checkbox"
                checked={selected.includes(variant.id)}
                onChange={() => toggleVariant(variant.id)}
              />
              {variant.creative.headline}
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-sand-700">
          Confidence Level
          <select
            value={confidence}
            onChange={(event) => setConfidence(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
          >
            <option value={0.8}>0.80</option>
            <option value={0.9}>0.90</option>
            <option value={0.95}>0.95</option>
            <option value={0.99}>0.99</option>
          </select>
        </label>
        <label className="text-sm text-sand-700">
          Sample Size
          <input
            type="number"
            value={sampleSize}
            onChange={(event) => setSampleSize(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
          />
        </label>
      </div>
      <label className="text-sm text-sand-700">
        Duration (hours): {duration}
        <input
          type="range"
          min={24}
          max={168}
          value={duration}
          onChange={(event) => setDuration(Number(event.target.value))}
          className="mt-2 w-full"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-sand-700">
        <input type="checkbox" checked={manualSplit} onChange={() => setManualSplit(!manualSplit)} />
        Manual traffic split
      </label>
      {manualSplit && (
        <div className="space-y-2">
          {selectedVariants.map((variant) => (
            <label key={variant.id} className="text-xs text-sand-600">
              {variant.creative.headline}
              <input
                type="number"
                min={0}
                max={100}
                value={split[variant.id] ?? 0}
                onChange={(event) => updateSplit(variant.id, Number(event.target.value))}
                className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
              />
            </label>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="primary"
        onClick={() =>
          onSubmit({
            variant_ids: selected,
            confidence_level: confidence,
            target_sample_size: sampleSize,
            duration_hours: duration,
            traffic_split: manualSplit ? split : null
          })
        }
      >
        Create Experiment
      </Button>
    </Card>
  );
}
