# Use the latest Node.js LTS runtime as a parent image
FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the backend service
CMD ["pnpm", "start"]
