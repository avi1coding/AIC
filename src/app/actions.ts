
'use server';

import { analyzeHomeworkText } from '@/ai/flows/analyze-homework-text';
import { detectAIGeneratedContentInPDF } from '@/ai/flows/detect-ai-generated-content-pdf';
import { aiTestFlow } from '@/ai/flows/ai-test-flow';
import { humanizeText } from '@/ai/flows/humanize-text';
import { firebaseConfig } from '@/firebase/config';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';


export type AnalysisResultData = {
  isAiGenerated: boolean;
  confidenceScore: number;
  explanation: string;
};

const FREE_TIER_DAILY_LIMIT = 3;

// Helper to get today's date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    
    // Note: The `GOOGLE_APPLICATION_CREDENTIALS` environment variable
    // is automatically set by Firebase App Hosting.
    return admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId,
    });
}

/**
 * Checks and updates the user's API usage.
 * @param userId - The ID of the user to check.
 * @returns {Promise<{isAllowed: boolean; message: string; remainingUses?: number}>}
 */
export async function checkAndIncrementUsage(userId: string): Promise<{isAllowed: boolean; message: string; remainingUses?: number}> {
  const app = initializeAdminApp();
  const firestore = app.firestore();
  const userRef = firestore.collection('users').doc(userId);

  try {
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // This case should ideally not happen for a logged-in user
      // but we handle it just in case.
      await userRef.set({
        id: userId,
        email: 'unknown', // This should be updated on user creation
        creationDate: FieldValue.serverTimestamp(),
        subscriptionTier: 'free',
        usageCount: 1,
        lastUsageDate: getTodayDateString(),
      });
      return { isAllowed: true, message: 'Usage recorded.', remainingUses: FREE_TIER_DAILY_LIMIT - 1 };
    }

    const userData = userDoc.data()!;
    const { subscriptionTier = 'free', usageCount = 0, lastUsageDate } = userData;

    // Paid users have unlimited access
    if (subscriptionTier !== 'free') {
      return { isAllowed: true, message: 'Paid user, unlimited access.' };
    }

    const today = getTodayDateString();

    // If last usage was before today, reset the counter
    if (lastUsageDate !== today) {
      await userRef.update({ usageCount: 1, lastUsageDate: today });
      return { isAllowed: true, message: 'First use of the day. Usage recorded.', remainingUses: FREE_TIER_DAILY_LIMIT - 1 };
    }

    // Check if the user is over the daily limit
    if (usageCount >= FREE_TIER_DAILY_LIMIT) {
      return { isAllowed: false, message: 'You have reached your daily limit of 3 free uses. Please upgrade for unlimited access.', remainingUses: 0 };
    }

    // Increment the usage count for today
    await userRef.update({ usageCount: FieldValue.increment(1) });
    return { isAllowed: true, message: 'Usage recorded.', remainingUses: FREE_TIER_DAILY_LIMIT - (usageCount + 1) };

  } catch (error) {
    console.error("Error in checkAndIncrementUsage:", error);
    // In case of a database error, we fail open to not block the user, but log the issue.
    // For a production app, you might want to fail closed.
    return { isAllowed: true, message: "Could not verify usage, proceeding." };
  }
}


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
