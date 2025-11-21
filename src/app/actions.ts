
'use server';

import { analyzeHomeworkText } from '@/ai/flows/analyze-homework-text';
import { detectAIGeneratedContentInPDF } from '@/ai/flows/detect-ai-generated-content-pdf';
import { aiTestFlow } from '@/ai/flows/ai-test-flow';
import { humanizeText } from '@/ai/flows/humanize-text';

export type AnalysisResultData = {
  isAiGenerated: boolean;
  confidenceScore: number;
  explanation: string;
};

export async function analyzeTextAction(
  text: string
): Promise<AnalysisResultData> {
  if (!text || text.length < 50) {
    throw new Error('Text is too short for a meaningful analysis. Please provide at least 50 characters.');
  }
  try {
    const result = await analyzeHomeworkText({ text });
    return result;
  } catch (error) {
    console.error('Error in analyzeTextAction:', error);
    throw new Error('Failed to analyze text. Please try again.');
  }
}

export async function analyzeFileAction(
  dataUri: string
): Promise<AnalysisResultData> {
  if (!dataUri) {
    throw new Error('File data is missing.');
  }

  try {
    const result = await detectAIGeneratedContentInPDF({ pdfDataUri: dataUri });

    const isAiGenerated =
      (result.analysisResult && result.analysisResult.toLowerCase().includes('ai-generated')) ||
      result.confidenceScore > 0.6;

    return {
      isAiGenerated,
      confidenceScore: result.confidenceScore,
      explanation: result.analysisResult || 'Analysis complete.',
    };
  } catch (error) {
    console.error('Error in analyzeFileAction:', error);
    throw new Error('Failed to analyze file. The file may be corrupted or in an unsupported format. Please try again.');
  }
}

export async function aiTest(input: {text: string}): Promise<{response: string}> {
    if (!input.text) {
        throw new Error("Input text is missing.");
    }
    try {
        const result = await aiTestFlow(input);
        return result;
    } catch(e) {
        console.error("Error in aiTest:", e);
        throw new Error("Failed to get response from AI.");
    }
}

export async function humanizeTextAction(
  text: string
): Promise<{ humanizedText: string }> {
  if (!text) {
    throw new Error('Text to humanize is missing.');
  }
  try {
    const result = await humanizeText({ text });
    return result;
  } catch (error) {
    console.error('Error in humanizeTextAction:', error);
    throw new Error('Failed to humanize text. Please try again.');
  }
}
