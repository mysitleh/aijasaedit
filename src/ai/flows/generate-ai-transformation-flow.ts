'use server';
/**
 * @fileOverview AI media transformation flow. Generates AI media transformations based on user description.
 *
 * - generateAiTransformation - A function that handles the AI media transformation process.
 * - GenerateAiTransformationInput - The input type for the generateAiTransformation function.
 * - GenerateAiTransformationOutput - The return type for the generateAiTransformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiTransformationInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "The media to be transformed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the desired transformation.'),
});
export type GenerateAiTransformationInput = z.infer<typeof GenerateAiTransformationInputSchema>;

const GenerateAiTransformationOutputSchema = z.object({
  transformedMediaDataUris: z
    .array(z.string())
    .describe('The transformed media options, as an array of data URIs.'),
});
export type GenerateAiTransformationOutput = z.infer<typeof GenerateAiTransformationOutputSchema>;

export async function generateAiTransformation(input: GenerateAiTransformationInput): Promise<GenerateAiTransformationOutput> {
  return generateAiTransformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiTransformationPrompt',
  input: {schema: GenerateAiTransformationInputSchema},
  output: {schema: GenerateAiTransformationOutputSchema},
  prompt: `You are an expert AI media transformer.

You will transform the given media based on the user's description.

Description: {{{description}}}
Media: {{media url=mediaDataUri}}

Ensure the output is a valid data URI.
`,
});

const generateAiTransformationFlow = ai.defineFlow(
  {
    name: 'generateAiTransformationFlow',
    inputSchema: GenerateAiTransformationInputSchema,
    outputSchema: GenerateAiTransformationOutputSchema,
  },
  async (input) => {
    const generationPromises = Array(3).fill(null).map(() => 
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
          { media: { url: input.mediaDataUri } },
          { text: input.description },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      })
    );

    const results = await Promise.all(generationPromises);
    const transformedMediaDataUris = results
      .map((result) => result.media?.url)
      .filter((url): url is string => !!url);

    return {
      transformedMediaDataUris,
    };
  }
);
