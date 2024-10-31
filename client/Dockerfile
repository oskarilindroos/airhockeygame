FROM node:20-alpine AS build

# Define build arguments for environment variables
ARG VITE_API_URL

# Set environment variables during the build process
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Use Nginx as the production server
FROM nginx:alpine

# Copy the built Vite app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
