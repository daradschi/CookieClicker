FROM oven/bun:1.4.2-debian

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bunx @tailwindcss/cli -i ./src/styles.css -o ./public/dist.css

EXPOSE 3000
CMD ["bun", "run", "src/index.ts" ]