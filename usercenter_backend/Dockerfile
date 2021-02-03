FROM node:14
ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod

COPY config ./
COPY dist ./

CMD ["node", "dist/server.js"]