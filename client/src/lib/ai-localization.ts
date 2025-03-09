import { apiRequest } from "@/lib/queryClient";

export type LocalizationContext = {
  region: string;
  background: string;
  experience: string;
  interests: string;
};

export async function generateLocalizedResources(
  nodeTitle: string,
  nodeDescription: string,
  context: LocalizationContext
) {
  try {
    const response = await apiRequest("POST", "/api/localize", {
      nodeTitle,
      nodeDescription,
      context
    });

    const content = await response.json();

    if (!content.resources || !Array.isArray(content.resources)) {
      throw new Error('Invalid response format: missing resources array');
    }

    return content;
  } catch (error: any) {
    console.error('Error generating localized resources:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse API response. Please try again.');
    }
    throw new Error(error.message || 'Failed to generate localized content');
  }
}