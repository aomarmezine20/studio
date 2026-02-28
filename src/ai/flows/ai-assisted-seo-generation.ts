'use server';
/**
 * @fileOverview This file provides an AI assistant flow for generating SEO-optimized titles and descriptions.
 *
 * - aiAssistedSeoGeneration - A function that leverages AI to suggest SEO titles and descriptions for various content types.
 * - AiAssistedSeoGenerationInput - The input type for the aiAssistedSeoGeneration function.
 * - AiAssistedSeoGenerationOutput - The return type for the aiAssistedSeoGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistedSeoGenerationInputSchema = z.object({
  contentType: z
    .enum(['article', 'event', 'publication'])
    .describe('The type of content for which SEO suggestions are needed.'),
  content: z.string().describe('The main text content for which to generate SEO suggestions.'),
  existingTitle: z.string().optional().describe('An optional existing title to base suggestions on.'),
  existingDescription: z.string().optional().describe('An optional existing description to base suggestions on.'),
});
export type AiAssistedSeoGenerationInput = z.infer<typeof AiAssistedSeoGenerationInputSchema>;

const AiAssistedSeoGenerationOutputSchema = z.object({
  seoTitle: z.string().describe('The AI-suggested SEO-optimized title.'),
  seoDescription: z.string().describe('The AI-suggested SEO-optimized description.'),
});
export type AiAssistedSeoGenerationOutput = z.infer<typeof AiAssistedSeoGenerationOutputSchema>;

export async function aiAssistedSeoGeneration(
  input: AiAssistedSeoGenerationInput
): Promise<AiAssistedSeoGenerationOutput> {
  return aiAssistedSeoGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistedSeoGenerationPrompt',
  input: {schema: AiAssistedSeoGenerationInputSchema},
  output: {schema: AiAssistedSeoGenerationOutputSchema},
  prompt: `You are an expert SEO content strategist. Your task is to generate an SEO-optimized title and a concise, engaging meta description for the provided content.

Consider the following:
-   **Content Type**: {{{contentType}}}
-   **Content**: {{{content}}}
{{#if existingTitle}}
-   **Existing Title**: {{{existingTitle}}}
{{/if}}
{{#if existingDescription}}
-   **Existing Description**: {{{existingDescription}}}
{{/if}}

Guidelines for generation:
1.  **SEO Title**: Create a compelling and informative title (under 60 characters) that accurately reflects the content, incorporates relevant keywords, and encourages clicks. If an existing title is provided, try to improve upon it while retaining core meaning.
2.  **SEO Description**: Write a concise and engaging meta description (under 160 characters) that summarizes the content, includes important keywords, and acts as a call to action. If an existing description is provided, try to improve upon it to be more impactful and keyword-rich.

Ensure the output is in JSON format matching the schema for 'seoTitle' and 'seoDescription'.`,
});

const aiAssistedSeoGenerationFlow = ai.defineFlow(
  {
    name: 'aiAssistedSeoGenerationFlow',
    inputSchema: AiAssistedSeoGenerationInputSchema,
    outputSchema: AiAssistedSeoGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
