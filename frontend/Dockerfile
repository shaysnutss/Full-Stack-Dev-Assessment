# Docker image of Node.js runtime 
FROM node:14

# Setting the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies listed in package.json
RUN npm install

# Copy the rest of the application code
COPY . .

#RUN npm install typescript @types/react @types/react-dom @types/node --save-dev

# Enable public access on port 3000 
EXPOSE 3000

# Run  app in dev mode
CMD ["npm", "start"]

