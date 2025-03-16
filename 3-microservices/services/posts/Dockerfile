# Use a Node.js base image
FROM node:16-alpine

# Set working directory inside the container
WORKDIR /srv

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
