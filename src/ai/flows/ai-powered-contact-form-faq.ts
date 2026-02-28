'use server';

/**
 * @fileOverview A Genkit flow for an AI assistant suggesting relevant FAQ answers from website content
 *               based on a user's contact form query.
 *
 * - aiPoweredContactFormFaq - A function that handles the AI-powered FAQ suggestion process.
 * - AIPoweredContactFormFaqInput - The input type for the aiPoweredContactFormFaq function.
 * - AIPoweredContactFormFaqOutput - The return type for the aiPoweredContactFormFaq function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIPoweredContactFormFaqInputSchema = z.object({
  query: z.string().describe("The user's question in the contact form."),
});
export type AIPoweredContactFormFaqInput = z.infer<typeof AIPoweredContactFormFaqInputSchema>;

const AIPoweredContactFormFaqOutputSchema = z.object({
  suggestions: z.array(z.object({
    title: z.string().describe("The title of the suggested answer."),
    content: z.string().describe("The content of the suggested answer.")
  })).describe("A list of suggested FAQ answers based on the query. Provide up to 3 most relevant suggestions."),
});
export type AIPoweredContactFormFaqOutput = z.infer<typeof AIPoweredContactFormFaqOutputSchema>;

// Simulated website content for demonstration purposes.
// In a real application, this would be fetched from Firestore, a search index, or other content sources.
const sampleWebsiteContent = [
  {
    title: "Comment adhérer à l'association ?",
    content: "Pour adhérer à l'association ScienceConnect, veuillez visiter notre page 'Adhésion' et suivre les instructions. Vous y trouverez les différentes catégories d'adhésion et le formulaire à remplir."
  },
  {
    title: "Où puis-je trouver les publications de l'association ?",
    content: "Nos publications, y compris la Revue des Études Économiques et Management (REEM), les ouvrages spéciaux et les rapports de recherche, sont disponibles dans la section 'Production et Publications' de notre site web."
  },
  {
    title: "Quels types d'événements organisez-vous ?",
    content: "Nous organisons une variété d'événements scientifiques tels que des colloques, conférences, journées d'étude, séminaires doctoraux, webinaires et tables rondes à distance. Consultez la section 'Événements Scientifiques' pour le calendrier."
  },
  {
    title: "Proposez-vous des formations ?",
    content: "Oui, nous offrons des formations thématiques, des ateliers méthodologiques (SPSS, NVivo) et des formations transversales (soft skills). Nous accompagnons également les doctorants. Plus de détails dans la section 'Formations et Animation'."
  },
  {
    title: "Comment contacter l'association ?",
    content: "Vous pouvez nous contacter via le formulaire de contact sur la page 'Contact', où vous trouverez également nos coordonnées et une FAQ."
  },
  {
    title: "Quel est l'objectif de ScienceConnect ?",
    content: "Les objectifs de ScienceConnect sont de promouvoir la recherche scientifique, de faciliter les échanges entre chercheurs, de diffuser les connaissances et de contribuer au développement économique et social par l'expertise scientifique. Plus d'informations sur la page 'Objectifs'."
  },
  {
    title: "Qu'est-ce que la REEM ?",
    content: "La Revue des Études Économiques et Management (REEM) est une de nos publications phares. C'est une revue scientifique qui publie des articles de recherche originaux dans le domaine de l'économie et du management."
  },
  {
    title: "Nous contacter",
    content: "Vous pouvez nous joindre via le formulaire sur la page Contact, ou par téléphone au +33 1 23 45 67 89 et par email à contact@scienceconnect.org. Notre adresse est 123 Rue de la Science, 75000 Paris, France."
  }
];

/**
 * A Genkit tool that simulates retrieving relevant content from the website.
 * In a real application, this would query a database or search index.
 */
const getWebsiteContent = ai.defineTool(
  {
    name: 'getWebsiteContent',
    description: 'Retrieves relevant content from the website, including FAQ, articles, and other pages, based on keywords provided. Use this tool to get context before answering the user\'s query.',
    inputSchema: z.object({
      keywords: z.array(z.string()).describe('A list of 1-3 keywords or short phrases extracted from the user\'s query that are most likely to match relevant website content. Prioritize nouns and key terms.'),
    }),
    outputSchema: z.string().describe('A formatted string containing relevant website content (titles and descriptions).'),
  },
  async (input) => {
    const { keywords } = input;
    let relevantContent = [];

    if (keywords && keywords.length > 0) {
      const lowerCaseKeywords = keywords.map(k => k.toLowerCase());
      relevantContent = sampleWebsiteContent.filter(item =>
        lowerCaseKeywords.some(keyword =>
          item.title.toLowerCase().includes(keyword) || item.content.toLowerCase().includes(keyword)
        )
      );
    }

    // Fallback: if no specific keyword match, provide some general information
    if (relevantContent.length === 0) {
      relevantContent = sampleWebsiteContent.filter(item =>
        item.title.toLowerCase().includes('adhérer') ||
        item.title.toLowerCase().includes('contact') ||
        item.title.toLowerCase().includes('objectif') ||
        item.content.toLowerCase().includes('adhésion') ||
        item.content.toLowerCase().includes('contacter') ||
        item.content.toLowerCase().includes('objectifs')
      ).slice(0, 3); // Limit to 3 general items

      if (relevantContent.length === 0) {
        // If still no content, return a default message
        return "No specific relevant content found. You can always visit our 'Contact' page for more options.";
      }
    }

    return relevantContent.map(item => `Title: ${item.title}\nContent: ${item.content}`).join('\n---\n');
  }
);

/**
 * Defines the prompt for the AI assistant to suggest FAQ answers.
 * It uses the 'getWebsiteContent' tool to retrieve context.
 */
const suggestFaqPrompt = ai.definePrompt({
  name: 'suggestFaqPrompt',
  input: { schema: AIPoweredContactFormFaqInputSchema },
  output: { schema: AIPoweredContactFormFaqOutputSchema },
  tools: [getWebsiteContent],
  system: `You are an intelligent AI assistant for the scientific association "ScienceConnect". Your role is to help users quickly find answers to their questions by suggesting relevant information from the website's content.

Instructions:
1.  **Analyze the User's Query**: Carefully read the user's question to understand their intent.
2.  **Use the Tool**: Based on the user's query, identify 1-3 key terms or phrases that represent the core subject of the question. Immediately call the 'getWebsiteContent' tool with these keywords to retrieve relevant information from the website. For example, if the query is "How do I join?", you might extract keywords like ["join", "membership"].
3.  **Synthesize Suggestions**: Once you have received the content from the tool, analyze it. Identify the most direct and helpful answers or snippets that address the user's question. Focus on clarity and conciseness.
4.  **Format Output**: Provide up to 3 highly relevant suggestions. Each suggestion must include a 'title' (a short, descriptive heading) and 'content' (the actual answer or relevant snippet). If, after using the tool, you still cannot find highly relevant information, provide general contact information or guide the user to relevant sections of the website (e.g., "Visit our 'Contact' page"). Always return the expected JSON structure, even if the 'suggestions' array is empty or contains default guidance.

Be concise, accurate, and focus on providing actionable information. Respond in French.
`,
  prompt: `User's Query: "{{{query}}}"`
});

/**
 * Main function to call the AI-powered FAQ suggestion flow.
 * @param input The user's question in the contact form.
 * @returns A list of suggested FAQ answers.
 */
export async function aiPoweredContactFormFaq(input: AIPoweredContactFormFaqInput): Promise<AIPoweredContactFormFaqOutput> {
  return aiPoweredContactFormFaqFlow(input);
}

/**
 * Defines the Genkit flow for suggesting FAQ answers using the AI assistant.
 */
const aiPoweredContactFormFaqFlow = ai.defineFlow(
  {
    name: 'aiPoweredContactFormFaqFlow',
    inputSchema: AIPoweredContactFormFaqInputSchema,
    outputSchema: AIPoweredContactFormFaqOutputSchema,
  },
  async (input) => {
    const { output } = await suggestFaqPrompt(input);
    if (!output) {
      throw new Error('Failed to get suggestions from AI assistant.');
    }
    return output;
  }
);
