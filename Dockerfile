FROM oven/bun

WORKDIR /app

COPY package*.json ./
RUN bun install

COPY . .

# Just generate Prisma client (migrate nahi)
RUN bunx prisma generate

EXPOSE 3000

# Do migrate deploy + start app at runtime
CMD sh -c "bunx prisma migrate deploy && bun src/app.ts"
