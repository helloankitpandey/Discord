FROM oven/bun

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN bun install 

# Copy all source files
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Expose port
EXPOSE 3000

# Use a shell form to allow multiple commands with `&&`
CMD bunx prisma migrate deploy &&  && bun src/app.ts
