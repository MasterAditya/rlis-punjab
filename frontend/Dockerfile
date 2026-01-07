# 1. Use an official Node.js runtime as a parent image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first
# This allows Docker to cache dependencies so builds are faster
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Expose the port that Vite is configured to use (see vite.config.js)
EXPOSE 3000

# 7. Start the app
# Check your package.json "scripts" to see if it is 'dev' or 'start'
CMD ["npm", "run", "dev"]