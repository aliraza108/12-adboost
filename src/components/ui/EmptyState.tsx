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
      <div className="text-5xl">SAND</div>
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
