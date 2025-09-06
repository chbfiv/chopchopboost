import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Modality } from '@google/genai';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const app = express();
const port = process.env.PORT || 3001;

const NANO_BANANA_MODEL = 'gemini-2.5-flash-image-preview';
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from frontend dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const fileToBase64 = (buffer, mimeType) => {
  return buffer.toString('base64');
};

const constructMilestonePrompt = (prompt, imageBuffer, mimeType) => {
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
3.  Generate vibrant, exciting wrapper art for the Booster. The art should look like a real TCG booster pack with minimal to no text. Use a solid black or white background so that the frontend can mask it out for transparency.

Structure your response by alternating between text descriptions (Title and Description) and the corresponding generated image for each Booster.
  `;

  const parts = [];

  if (imageBuffer) {
    const base64Data = fileToBase64(imageBuffer, mimeType);
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }

  parts.push({ text: userGoalText });

  return parts;
};

const constructTaskPrompt = (milestone, seriesTheme) => {
  const userGoalText = `
You are a master card designer for the TCG "Chop Chop Booster".
The user is opening a Booster from the "${seriesTheme}" Series called: "${milestone.title}".

Your job is to create the 3 collectible "Cards" found inside this Booster.
For EACH of the 3 Cards:
1.  Provide a clear, action-oriented title. Start this line with "Title:". (e.g., "Card: Gather Components", "Card: Assemble the Base").
2.  Provide a numbered list of 2-3 simple, actionable details, like the rules text on a card. Start this section with "Details:".
3.  Generate simple, clear, and thematic card art. The illustration should be a visual cue for the card's action, with minimal to no text. Use a solid black or white background so that the frontend can mask it out for transparency.

Structure your response by alternating between the text block (Title and Details) and the corresponding generated image for each Card.
  `;
  return [{ text: userGoalText }];
};

const parseMilestonesFromParts = (parts) => {
  const milestones = [];
  let currentMilestone = {};
  let lastText = '';

  for (const part of parts) {
    if (part.text) {
      const text = part.text.trim();
      lastText = text;
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

    // Accept milestone if it has title and imageUrl, even if description is missing
    if (currentMilestone.title && currentMilestone.imageUrl) {
      if (!currentMilestone.description) {
        currentMilestone.description = '(No description provided)';
      }
      milestones.push(currentMilestone);
      currentMilestone = {};
    }
  }

  if (milestones.length === 0) {
    console.error("Failed to parse parts from AI. Response parts:", JSON.stringify(parts, null, 2));
    // Add fallback milestone for debugging
    milestones.push({
      title: 'Parsing Error',
      description: 'Could not parse the plan from the AI. See server logs for details.',
      imageUrl: '',
      rawParts: parts,
      lastText,
    });
  }

  return milestones;
};

const parseTasksFromParts = (parts) => {
  const tasks = [];
  let currentTask = {};

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
          .map(d => d.replace(/^\d+\.\s*/, '').trim())
          .filter(d => d);
      }
    } else if (part.inlineData) {
      currentTask.imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }

    if (currentTask.title && currentTask.details && currentTask.details.length > 0 && currentTask.imageUrl) {
      tasks.push(currentTask);
      currentTask = {};
    }
  }

  if (tasks.length === 0) {
    console.error("Failed to parse tasks from AI. Response parts:", JSON.stringify(parts, null, 2));
    throw new Error("Could not break down the milestone. Please try again.");
  }

  return tasks;
};

const sendRequestToAI = async (contentParts) => {
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

app.post('/api/generate-milestones', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageFile = req.file;

    const contentParts = constructMilestonePrompt(prompt, imageFile ? imageFile.buffer : null, imageFile ? imageFile.mimetype : null);
    const responseParts = await sendRequestToAI(contentParts);
    const milestones = parseMilestonesFromParts(responseParts);

    res.json(milestones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate-tasks', async (req, res) => {
  try {
    const { milestone, seriesTheme } = req.body;

    const contentParts = constructTaskPrompt(milestone, seriesTheme);
    const responseParts = await sendRequestToAI(contentParts);
    const tasks = parseTasksFromParts(responseParts);

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
