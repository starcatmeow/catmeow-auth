FROM node:14
ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod

COPY config ./config
COPY dist ./dist

CMD ["node", "dist/server.js"]