"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const tones = [
  "urgency",
  "curiosity",
  "social_proof",
  "benefit_driven",
  "fear_of_missing_out",
  "empathy",
  "authority",
  "humor"
];

export function GenerateVariantsForm({
  onSubmit,
  loading
}: {
  onSubmit: (payload: { num_variants: number; tones: string[]; focus_element: "all" | "headline" | "cta" | "body" }) => void;
  loading?: boolean;
}) {
  const [numVariants, setNumVariants] = useState(3);
  const [focus, setFocus] = useState<"all" | "headline" | "cta" | "body">("all");
  const [selectedTones, setSelectedTones] = useState<string[]>(["urgency"]);

  const toggleTone = (tone: string) => {
    setSelectedTones((prev) =>
      prev.includes(tone) ? prev.filter((item) => item !== tone) : [...prev, tone]
    );
  };

  return (
    <Card className="space-y-4 p-6">
      <h3 className="font-display text-lg">Generate Variants</h3>
      <label className="text-sm text-sand-700">
        Number of variants: {numVariants}
        <input
          type="range"
          min={2}
          max={8}
          value={numVariants}
          onChange={(event) => setNumVariants(Number(event.target.value))}
          className="mt-2 w-full"
        />
      </label>
      <div>
        <p className="text-sm text-sand-700">Focus Element</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["all", "headline", "cta", "body"] as const).map((item) => (
            <Button
              key={item}
              type="button"
              variant={focus === item ? "primary" : "secondary"}
              onClick={() => setFocus(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-sand-700">Tones</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tones.map((tone) => (
            <Button
              key={tone}
              type="button"
              variant={selectedTones.includes(tone) ? "primary" : "secondary"}
              onClick={() => toggleTone(tone)}
            >
              {tone.replace(/_/g, " ")}
            </Button>
          ))}
        </div>
      </div>
      <Button
        type="button"
        variant="primary"
        className="w-full"
        loading={loading}
        onClick={() => onSubmit({ num_variants: numVariants, tones: selectedTones, focus_element: focus })}
      >
        Generate with AI
      </Button>
    </Card>
  );
}
