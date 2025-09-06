import { GoogleGenAI, Modality, Part } from "@google/genai";
import { Milestone, Task } from '../types';

const NANO_BANANA_MODEL = 'gemini-2.5-flash-image-preview';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

const constructMilestonePrompt = async (prompt: string, imageFile: File | null): Promise<Part[]> => {
    const userGoalText = `
You are a master card designer for the TCG "Chop Chop Booster". Your job is to design a new 'Series' based on a user's goal.
A Series contains 3 themed 'Boosters'.
Your tone should be exciting, like a real TCG designer announcing a new set.
The user's goal for this Series is: "${prompt}".

Here are the rules for the Boosters:
- The first two Boosters are the build-up steps, providing foundational skills for the Series theme.
- The third and final Booster MUST represent the achievement of the original goal itself. Its title should be the epic conclusion to the Series.

For EACH of the 3 Boosters:
1.  Provide a short, epic title for the Booster, starting with "Title:".
2.  Provide a concise, thematic description of what's inside, starting with "Description:".
3.  Generate vibrant, exciting wrapper art for the Booster. The art should look like a real TCG booster pack with minimal to no text. For the final Booster, the art should be a beautiful representation of the completed goal: "${prompt}".

Structure your response by alternating between text descriptions (Title and Description) and the corresponding generated image for each Booster.
    `;
    
    const parts: Part[] = [];

    if (imageFile) {
        const base64Data = await fileToBase64(imageFile);
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: imageFile.type,
            },
        });
    }

    parts.push({ text: userGoalText });

    return parts;
};

const constructTaskPrompt = (milestone: Milestone, seriesTheme: string): Part[] => {
    const userGoalText = `
You are a master card designer for the TCG "Chop Chop Booster".
The user is opening a Booster from the "${seriesTheme}" Series called: "${milestone.title}".

Your job is to create the 3 collectible "Cards" found inside this Booster.
For EACH of the 3 Cards:
1.  Provide a clear, action-oriented title. Start this line with "Title:". (e.g., "Card: Gather Components", "Card: Assemble the Base").
2.  Provide a numbered list of 2-3 simple, actionable details, like the rules text on a card. Start this section with "Details:".
3.  Generate simple, clear, and thematic card art. The illustration should be a visual cue for the card's action, with minimal to no text.

Structure your response by alternating between the text block (Title and Details) and the corresponding generated image for each Card.
    `;
    return [{ text: userGoalText }];
};


const parseMilestonesFromParts = (parts: Part[]): Milestone[] => {
    const milestones: Milestone[] = [];
    let currentMilestone: Partial<Milestone> = {};

    for (const part of parts) {
        if (part.text) {
            const text = part.text.trim();
            const titleMatch = text.match(/Title:([\s\S]*?)(?=Description:|$)/);
            if (titleMatch && titleMatch[1]) {
                currentMilestone.title = titleMatch[1].trim();
            }

            const descriptionMatch = text.match(/Description:([\s\S]*)/);
            if (descriptionMatch && descriptionMatch[1]) {
                currentMilestone.description = descriptionMatch[1].trim();
            }
        } else if (part.inlineData) {
            currentMilestone.imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        
        if (currentMilestone.title && currentMilestone.description && currentMilestone.imageUrl) {
            milestones.push(currentMilestone as Milestone);
            currentMilestone = {};
        }
    }

    if (milestones.length === 0) {
        console.error("Failed to parse parts from AI. Response parts:", JSON.stringify(parts, null, 2));
        throw new Error("Could not parse the plan from the AI's response. Please try again.");
    }
    
    return milestones;
}

const parseTasksFromParts = (parts: Part[]): Task[] => {
    const tasks: Task[] = [];
    let currentTask: Partial<Task> & { details?: string[] } = {};

    for (const part of parts) {
        if (part.text) {
            const text = part.text.trim();
            const titleMatch = text.match(/Title:([\s\S]*?)(?=Details:|$)/);
            if (titleMatch && titleMatch[1]) {
                currentTask.title = titleMatch[1].trim().replace(/^Card:\s*/, '');
            }

            const detailsMatch = text.match(/Details:([\s\S]*)/);
            if (detailsMatch && detailsMatch[1]) {
                currentTask.details = detailsMatch[1]
                    .trim()
                    .split('\n')
                    .map(d => d.replace(/^\d+\.\s*/, '').trim()) // Remove numbering like "1. "
                    .filter(d => d);
            }
        } else if (part.inlineData) {
            currentTask.imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }

        if (currentTask.title && currentTask.details && currentTask.details.length > 0 && currentTask.imageUrl) {
            tasks.push(currentTask as Task);
            currentTask = {};
        }
    }

    if (tasks.length === 0) {
        console.error("Failed to parse tasks from AI. Response parts:", JSON.stringify(parts, null, 2));
        throw new Error("Could not break down the milestone. Please try again.");
    }
    
    return tasks;
};

const sendRequestToAI = async (contentParts: Part[]) => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    
    const response = await ai.models.generateContent({
        model: NANO_BANANA_MODEL,
        contents: { parts: contentParts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
  
    const parts = response.candidates?.[0]?.content?.parts || [];
    if (parts.length === 0) {
        throw new Error("The AI did not return a plan. It might be a restricted topic. Please try a different goal.");
    }
    return parts;
};

export const generateMilestonesPlan = async (prompt: string, imageFile: File | null): Promise<Milestone[]> => {
  const contentParts = await constructMilestonePrompt(prompt, imageFile);
  const responseParts = await sendRequestToAI(contentParts);
  return parseMilestonesFromParts(responseParts);
};

export const generateTasksForMilestone = async (milestone: Milestone, seriesTheme: string): Promise<Task[]> => {
    const contentParts = constructTaskPrompt(milestone, seriesTheme);
    const responseParts = await sendRequestToAI(contentParts);
    return parseTasksFromParts(responseParts);
};