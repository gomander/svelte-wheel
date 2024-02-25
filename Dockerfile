FROM node:lts-slim
RUN apt-get update && apt-get install -y fonts-quicksand
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN npm i -g pnpm && pnpm i --frozen-lockfile
CMD ["node", "."]
