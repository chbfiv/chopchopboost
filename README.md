# Chop Chop Boost


DEMO AT

https://chopchopboost-53585612799.us-central1.run.app/

Turn your goals into a Pokémon-style Trading Card Game! Define your 'Series', collect themed 'Boosters' for each milestone, and reveal powerful 'Cards' to master new skills. Test

## Project Structure

```
/
├── frontend/          # React + TypeScript frontend
├── backend/           # Node.js + Express backend
├── Dockerfile         # Docker container
├── .github/workflows/ # CI/CD pipeline
├── PLAN.md            # Development plan
└── README.md
```

## Local Development

### Prerequisites
- Node.js 18+
- Google Gemini API key

### Setup
1. Clone the repository
2. Set up environment variables:
   - Copy `.env.local` to `frontend/.env.local` and set `VITE_API_BASE_URL=http://localhost:3001`
   - Set `API_KEY` in backend environment

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

5. Run backend:
   ```bash
   cd backend
   npm run dev
   ```

6. Run frontend (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

7. Open http://localhost:5173

## Docker Development

Build and run with Docker:
```bash
docker build -t chopchopboost .
docker run -p 3001:3001 -e API_KEY=your_api_key chopchopboost
```

## Deployment

The app is configured for deployment to Google Cloud Run via GitHub Actions.

### Setup
1. Create a GCP project
2. Enable Cloud Run and Container Registry APIs
3. Create a service account with necessary permissions
4. Add secrets to GitHub repository:
   - `GCP_SA_KEY`: Service account JSON key
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `API_KEY`: Google Gemini API key

### Deploy
Push to the `main` branch to trigger automatic deployment.

## Features
- AI-powered goal breakdown
- Interactive TCG-style interface
- Milestone and task generation
- Image upload support
- Responsive design

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: Google Gemini
- **Deployment**: Docker, Google Cloud Run
