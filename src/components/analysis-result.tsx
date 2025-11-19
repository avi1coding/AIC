import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { AnalysisResultData } from '@/app/actions';

export function AnalysisResult({
  isAiGenerated,
  confidenceScore,
  explanation,
}: AnalysisResultData) {
  const scoreInPercent = Math.round(confidenceScore * 100);
  const resultTitle = isAiGenerated
    ? 'Potential AI Content Detected'
    : 'Appears Human-Written';
  const ResultIcon = isAiGenerated ? AlertTriangle : CheckCircle;
  const iconColor = isAiGenerated ? 'text-destructive' : 'text-chart-2';
  const scoreDescription = isAiGenerated
    ? 'High confidence of AI involvement.'
    : 'Low confidence of AI involvement.';

  const getProgressColor = (score: number) => {
    if (score > 0.75) return 'hsl(var(--destructive))';
    if (score > 0.5) return 'hsl(var(--chart-5))';
    return 'hsl(var(--chart-2))';
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <ResultIcon className={iconColor} />
          <span>{resultTitle}</span>
        </CardTitle>
        <CardDescription>{scoreDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold">Confidence Score</h3>
            <span
              className="font-headline font-bold text-3xl"
              style={{ color: getProgressColor(confidenceScore) }}
            >
              {scoreInPercent}% AI
            </span>
          </div>
          <div
            style={
              {
                '--primary': getProgressColor(confidenceScore),
              } as React.CSSProperties
            }
          >
            <Progress value={scoreInPercent} />
          </div>
        </div>
        {explanation && (
          <div className="space-y-2">
            <h3 className="font-semibold">Summary</h3>
            <p className="text-sm text-muted-foreground">{explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
