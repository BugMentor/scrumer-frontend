
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateIssueDescription = async (title: string): Promise<{ description: string, points: number }> => {
  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex text generation tasks.
      model: "gemini-3-pro-preview",
      contents: `Generate a professional Jira-style issue description for: "${title}". Include a summary, acceptance criteria, and a suggested story point estimate (fibonacci: 1, 2, 3, 5, 8, 13).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "Markdown formatted description including Acceptance Criteria."
            },
            points: {
              type: Type.NUMBER,
              description: "Suggested story points."
            }
          },
          required: ["description", "points"]
        }
      },
    });

    // Extract text directly from the response object property.
    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      description: "Failed to generate AI description. Please write manually.", 
      points: 1 
    };
  }
};

export const summarizeProject = async (issues: any[]): Promise<string> => {
  try {
    const issueList = issues.map(i => `- ${i.title} (${i.status})`).join('\n');
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a high-level executive summary of this project progress based on these issues:\n${issueList}`,
    });
    // Extract text directly from the response object property.
    return response.text || "No summary available.";
  } catch (error) {
    return "Error generating summary.";
  }
};
