FROM node:lts-slim
RUN apt-get update && apt-get install -y fonts-noto-cjk fonts-noto-color-emoji fonts-quicksand fonts-noto-core
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g npm
RUN npm install --omit=dev
COPY . ./
CMD [ "npm", "run", "start" ]
