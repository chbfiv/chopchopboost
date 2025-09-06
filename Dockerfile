# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package.json and install dependencies
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --only=production

# Copy frontend and build
COPY frontend/ ./frontend/
RUN cd frontend && npm ci && npm run build

# Copy backend source
COPY backend/ ./backend/

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "backend/server.js"]
