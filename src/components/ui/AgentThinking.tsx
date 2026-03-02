"use client";

import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function AgentThinking({ message }: { message: string }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="flex items-center gap-4 border-dashed border-terracotta/40 bg-terracotta-light/40 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta text-white">
        <Brain size={20} />
      </div>
      <div>
        <p className="font-display text-lg text-sand-900">{message}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-sand-600">
          <span>Thinking... {seconds}s</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-terracotta" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-terracotta [animation-delay:0.2s]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-terracotta [animation-delay:0.4s]" />
          </span>
        </div>
      </div>
    </Card>
  );
}
