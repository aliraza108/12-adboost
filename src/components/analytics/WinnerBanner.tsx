import { Card } from "@/components/ui/Card";

export function WinnerBanner({
  headline,
  ctr,
  cvr,
  significance
}: {
  headline: string;
  ctr: number;
  cvr: number;
  significance: number;
}) {
  return (
    <Card className="bg-gradient-to-r from-terracotta to-sage p-6 text-warm-white">
      <p className="text-xs uppercase tracking-[0.3em]">Winning Variant</p>
      <h2 className="mt-3 font-display text-3xl">{headline}</h2>
      <div className="mt-4 flex flex-wrap gap-6 text-sm">
        <div>
          <p className="text-xs uppercase">CTR</p>
          <p className="font-mono text-lg">{(ctr * 100).toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-xs uppercase">CVR</p>
          <p className="font-mono text-lg">{(cvr * 100).toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-xs uppercase">Significance</p>
          <p className="font-mono text-lg">{(significance * 100).toFixed(1)}%</p>
        </div>
      </div>
    </Card>
  );
}
