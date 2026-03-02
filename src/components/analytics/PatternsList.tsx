import { Card } from "@/components/ui/Card";
import { Sparkle, Target, MessageCircle, HeartHandshake } from "lucide-react";

const icons = [Sparkle, Target, MessageCircle, HeartHandshake];

export function PatternsList({
  patterns
}: {
  patterns: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {patterns.map((pattern, index) => {
        const Icon = icons[index % icons.length];
        return (
          <Card key={pattern.title} className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand-200 text-sand-700">
                <Icon size={18} />
              </div>
              <h4 className="font-display text-lg text-sand-900">{pattern.title}</h4>
            </div>
            <p className="mt-3 text-sm text-sand-600">{pattern.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
