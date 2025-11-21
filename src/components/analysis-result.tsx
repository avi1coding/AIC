import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Dot } from 'lucide-react';
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
    if (score > 75) return 'hsl(var(--destructive))';
    if (score > 50) return 'hsl(var(--chart-5))';
    return 'hsl(var(--chart-2))';
  };
  
  const explanationPoints = explanation
    ?.split(/(?=[-\u2022]|\d+\.\s)/) // Split by hyphens, bullets, or "1. "
    .map(point => point.trim().replace(/^[-\u2022]|\d+\.\s/, '')) // Remove the bullet/number
    .filter(point => point.length > 0);

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
              style={{ color: getProgressColor(scoreInPercent) }}
            >
              {scoreInPercent}% AI
            </span>
          </div>
          <Progress
            value={scoreInPercent}
            style={
              {
                '--progress-color': getProgressColor(scoreInPercent),
              } as React.CSSProperties
            }
          />
        </div>
        {explanationPoints && explanationPoints.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Summary</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-inside">
              {explanationPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Dot className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
