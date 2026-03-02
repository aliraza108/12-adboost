"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CampaignCreate } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  goal: z.enum(["clicks", "signups", "sales", "impressions", "leads"]),
  audience_segment: z.string().min(2, "Audience segment is required"),
  budget: z
    .union([z.number().positive(), z.nan()])
    .optional()
    .transform((value) => (Number.isNaN(value) ? undefined : value)),
  headline: z.string().min(3, "Headline is required"),
  body: z.string().optional(),
  cta: z.string().min(1, "CTA is required"),
  image_description: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function CampaignForm({
  onSubmit,
  loading
}: {
  onSubmit: (data: CampaignCreate) => void;
  loading?: boolean;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { goal: "clicks" }
  });

  const submit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      goal: values.goal,
      audience_segment: values.audience_segment,
      budget: values.budget,
      tags,
      base_creative: {
        headline: values.headline,
        body: values.body,
        cta: values.cta,
        image_description: values.image_description
      }
    });
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <Card className="space-y-4 p-6">
        <h2 className="font-display text-xl">Campaign Basics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-sand-700">
            Campaign Name
            <input
              {...register("name")}
              className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
              placeholder="Spring launch"
            />
            {errors.name && <p className="mt-1 text-xs text-terracotta">{errors.name.message}</p>}
          </label>
          <label className="text-sm text-sand-700">
            Goal
            <select
              {...register("goal")}
              className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
            >
              <option value="clicks">Clicks</option>
              <option value="signups">Signups</option>
              <option value="sales">Sales</option>
              <option value="impressions">Impressions</option>
              <option value="leads">Leads</option>
            </select>
          </label>
        </div>
        <label className="text-sm text-sand-700">
          Audience Segment
          <textarea
            {...register("audience_segment")}
            className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
            placeholder="e.g. startup founders, 25-40, tech-savvy"
          />
          {errors.audience_segment && (
            <p className="mt-1 text-xs text-terracotta">{errors.audience_segment.message}</p>
          )}
        </label>
        <label className="text-sm text-sand-700">
          Budget (optional)
          <input
            type="number"
            {...register("budget", { valueAsNumber: true })}
            className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
            placeholder="$5,000"
          />
        </label>
        <div>
          <p className="text-sm text-sand-700">Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-sand-200 px-2 py-1 text-xs text-sand-700">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              className="w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
              placeholder="Type and press enter"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={addTag}>
              Add
            </Button>
          </div>
        </div>
      </Card>
      <Card className="space-y-4 border border-sand-200 bg-sand-50 p-6">
        <h2 className="font-display text-xl">Base Creative</h2>
        <label className="text-sm text-sand-700">
          Headline
          <input
            {...register("headline")}
            className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
          />
          {errors.headline && <p className="mt-1 text-xs text-terracotta">{errors.headline.message}</p>}
        </label>
        <label className="text-sm text-sand-700">
          Body Copy (optional)
          <textarea
            {...register("body")}
            className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
          />
        </label>
        <label className="text-sm text-sand-700">
          CTA Button Text
          <input
            {...register("cta")}
            className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
          />
          {errors.cta && <p className="mt-1 text-xs text-terracotta">{errors.cta.message}</p>}
        </label>
        <label className="text-sm text-sand-700">
          Image Description (optional)
          <textarea
            {...register("image_description")}
            className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
          />
        </label>
      </Card>
      <Button type="submit" variant="primary" className="w-full" loading={loading}>
        Create Campaign
      </Button>
    </form>
  );
}
