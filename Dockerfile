# 1. Base Ubuntu image
FROM ubuntu:22.04

# 2. Set workdir
WORKDIR /app

# 3. Install dependencies: curl, git, openssl, etc.
RUN apt-get update && apt-get install -y \
        curl \
        git \
        openssl \
        ca-certificates \
        gnupg \
        unzip

# 4. Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# 5. Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

# 6. Copy package files and install deps
COPY package*.json ./
RUN bun install

# 7. Copy source files
COPY . .

# 8. Generate Prisma client
RUN bunx prisma generate

# 9. Expose port
EXPOSE 3000

# 10. Final run command
CMD bunx prisma migrate deploy && bun src/app.ts