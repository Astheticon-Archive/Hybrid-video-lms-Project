FROM node:18-slim

# Install system dependencies for Puppeteer/Chromium and FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Configure Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install project dependencies
COPY package.json ./
RUN npm install

# Copy source files
COPY . .

# Expose web server port
EXPOSE 3000

CMD ["npm", "run", "start"]
