# see all versions at https://hub.docker.com/r/oven/bun/tags
# FROM oven/bun:latest
FROM oven/bun:1.2.12
WORKDIR /usr/src/app

COPY . .
RUN bun install --frozen-lockfile

# ENV NODE_ENV=production
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "./src/server.ts" ]