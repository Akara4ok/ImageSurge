FROM node:21-alpine3.17
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY src ./src
COPY .env ./.env
COPY prisma ./prisma
RUN npm run db:generate
ENTRYPOINT npm run start2
