FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY ./package*.json .

RUN npm install -g @nestjs/cli && npm install -g prisma

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json .
RUN npm install --production

COPY --from=builder /usr/src/app/dist .

COPY --from=builder /usr/src/app/prisma ./prisma

RUN npx prisma generate

EXPOSE 3000 

CMD ["npm", "run", "start:prod"]