# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory to the root directory of your Node.js application
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your HTTP server listens on
EXPOSE 8080

# Command to run your application
CMD ["node", "index.js"]