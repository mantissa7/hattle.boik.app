FROM oven/bun:alpine AS base

WORKDIR /usr/src/app

COPY package.json ./
COPY bun.lock ./
COPY bunfig.toml ./
COPY tsconfig.json ./
COPY src ./src

RUN bun install
RUN bun build ./src/server.ts --compile --outfile hattle --minify --define:process.env.NODE_ENV='\"production\"'


FROM alpine:latest
COPY --from=base /usr/src/app/hattle .
RUN apk add libgcc libstdc++
ENTRYPOINT ["./hattle"]