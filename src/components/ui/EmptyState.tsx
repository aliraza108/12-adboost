import { Hourglass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Card className="flex flex-col items-center gap-4 px-10 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand-100 text-terracotta">
        <Hourglass size={28} />
      </div>
      <div>
        <h3 className="font-display text-2xl text-sand-900">{title}</h3>
        <p className="mt-2 text-sm text-sand-600">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
