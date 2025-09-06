# Chop Chop Boost - Development Plan

## Overview
Chop Chop Boost is a web application that turns user goals into a Pokémon-style Trading Card Game experience. Users input their goals, and the app generates themed "Boosters" (milestones) with collectible "Cards" (tasks) to achieve them.

## Architecture
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **AI**: Google Gemini for generating content
- **Deployment**: Docker + Google Cloud Run

## Project Structure
```
/
├── frontend/          # React app
├── backend/           # Express server
├── Dockerfile         # Container definition
├── .github/workflows/ # CI/CD pipeline
├── README.md
└── PLAN.md
```

## Features
- Goal input with optional image upload
- AI-generated milestone boosters
- Task breakdown for each milestone
- Responsive UI with dark mode
- Local development with hot reload
- Containerized deployment

## Development Workflow
1. **Local Dev**:
   - Run `npm run dev` in frontend/
   - Run `npm run dev` in backend/
   - Frontend proxies to backend at localhost:3001

2. **Build**:
   - Frontend: `npm run build`
   - Backend serves built frontend

3. **Deploy**:
   - Push to main branch
   - GitHub Actions builds Docker image
   - Deploys to Cloud Run

## Environment Variables
- `API_KEY`: Google Gemini API key
- `VITE_API_BASE_URL`: Frontend API base URL (localhost:3001 for dev)

## Next Steps
- Add user authentication
- Implement progress tracking
- Add more customization options
- Optimize AI prompts for better results
