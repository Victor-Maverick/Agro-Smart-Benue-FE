FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Set build-time environment variables for Next.js
# These are baked into the build
ARG NEXT_PUBLIC_API_BASE_URL=https://api.agrosmartbenue.com
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeRVQssAAAAAFFVrXBgCpPNyDPb1SqD1sI4Ywqm
ARG NEXT_PUBLIC_WEATHER_API_KEY=84a36ddea24d4e23b61115004250811
ARG NEXTAUTH_URL=https://www.agrosmartbenue.com
ARG NEXTAUTH_SECRET=prod-bfpc-2024-f7e6d5c4b3a29018fedcba9876543210fedcba9876543210fedcba9876543210

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_WEATHER_API_KEY=$NEXT_PUBLIC_WEATHER_API_KEY
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]