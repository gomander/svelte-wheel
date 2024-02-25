FROM node:lts-slim
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN npm i -g pnpm && pnpm i --frozen-lockfile
CMD ["node", "."]
