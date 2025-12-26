import z from "zod";

export const TechnicalFeedbackSchema = z.object({
  technicalAccuracy: z.string(),
  completeness: z.string(),
  bestPracticesAndCodeQuality: z.string(),
  understandingOfFundamentals: z.string(),
  abilityToExplainClearly: z.string(),
});

export const CommunicationFeedbackSchema = z.object({
  speechClarityAndPronunciation: z.string(),
  paceAndFluency: z.string(),
  excessiveFillers: z.string(),
  confidenceAndCoherence: z.string(),
});

export const SummarySchema = z.object({
  strengths: z.array(z.string()).min(1),
  areasForImprovement: z.array(z.string()).min(1),
  actionableRecommendations: z.array(z.string()).min(1),
});

export const FeedbackSchema = z.object({
  technicalFeedback: TechnicalFeedbackSchema,
  communicationFeedback: CommunicationFeedbackSchema,
  summary: SummarySchema,
});
