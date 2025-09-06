# Chop Chop Booster - Project Plan

## Overview
Chop Chop Booster is a React/TypeScript web application that transforms user goals into an interactive Pokémon-style Trading Card Game (TCG) experience. Using Google's Gemini AI, the app generates personalized "Series" consisting of themed "Boosters" (milestones) and collectible "Cards" (tasks) to help users achieve their objectives.

## Current Features

### Core Functionality
- **Goal Input**: Users can enter their goal and optionally upload an image for context
- **AI-Powered Generation**: Uses Gemini 2.5 Flash with image generation to create:
  - 3 themed boosters (milestones) per series
  - 3 collectible cards (tasks) per booster
  - Custom artwork for each booster and card
- **Interactive UI**: Card-based interface with booster pack opening mechanics
- **Progress Tracking**: Mark milestones as completed
- **Responsive Design**: Works on desktop and mobile devices

### Technical Stack
- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google GenAI SDK (@google/genai 1.17.0)
- **Styling**: Tailwind CSS (utility classes in components)
- **Environment**: Node.js with ES modules

### Project Structure
```
/
├── App.tsx                 # Main application component
├── types.ts                # TypeScript interfaces (Milestone, Task)
├── services/
│   └── geminiService.ts    # AI integration and content generation
├── components/
│   ├── GoalInputForm.tsx   # Initial goal input interface
│   ├── BoosterPackList.tsx # Display generated milestones
│   ├── CardViewerView.tsx  # Individual milestone details
│   ├── TaskCard.tsx        # Individual task display
│   ├── LoadingView.tsx     # Loading states
│   └── Header/Footer.tsx   # Layout components
└── Configuration files (package.json, vite.config.ts, etc.)
```

## Architecture

### Data Flow
1. User inputs goal → Gemini generates 3 milestones with images
2. User selects milestone → Gemini generates 3 tasks with images
3. Tasks are displayed as collectible cards
4. User can mark milestones as completed

### AI Integration
- **Model**: Gemini 2.5 Flash with image generation
- **Modalities**: Text and image generation
- **Prompt Engineering**: Structured prompts for consistent TCG-themed output
- **Parsing**: Custom parsers for AI response parts (text + images)

## Current Status
- ✅ Core functionality implemented
- ✅ AI integration working
- ✅ Responsive UI with card-based design
- ✅ Image generation and display
- ✅ Progress tracking
- ✅ Error handling

## Dependencies
- React 19.1.1
- Google GenAI 1.17.0
- TypeScript 5.8.2
- Vite 6.2.0
- Tailwind CSS (via CDN in index.html)

## Environment Setup
- Requires `GEMINI_API_KEY` environment variable
- Node.js environment
- Development: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Known Limitations
- Requires active internet for AI generation
- Image generation depends on Gemini API availability
- No offline functionality
- No user data persistence
- Single-user experience only

## Future Enhancement Ideas
- User authentication and data persistence
- Social features (sharing series, achievements)
- Offline mode with cached content
- Advanced customization options
- Multiple AI models support
- Export functionality (PDF, images)
- Achievement system and gamification
- Mobile app versions
- Multi-language support</content>
<parameter name="filePath">/Users/chbfiv/projects/chopchopboost/plan.md
