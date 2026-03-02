import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ErrorState({
  title,
  description,
  onRetry,
  actionLabel,
  onAction
}: {
  title: string;
  description: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Card className="flex flex-col items-start gap-3 border border-terracotta/30 bg-terracotta-light/40 p-6">
      <div>
        <h3 className="font-display text-xl text-sand-900">{title}</h3>
        <p className="text-sm text-sand-700">{description}</p>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Retry
          </Button>
        )}
        {actionLabel && onAction && (
          <Button variant="ghost" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
