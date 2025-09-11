# 1. Start from an official Node.js image (version 18 is a good choice)
FROM node:22-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# Copy both package.json and the lock file
COPY package.json yarn.lock ./

# Use 'yarn install' with a flag to strictly use the lock file
RUN yarn install --frozen-lockfile

# 5. Copy the rest of your application code into the container
COPY . .

# 6. Expose the port your app runs on
EXPOSE 8080

# 7. The command to run your application
CMD ["node", "index.js"]
