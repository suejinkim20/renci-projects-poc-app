#############
#  builder  #
#############

FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY app/package*.json ./
RUN npm ci

# Copy in source files
COPY app/ .

# Build app
RUN npm run build

############
#  server  #
############

FROM nginx:stable-alpine

# Expose port
EXPOSE 80

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
