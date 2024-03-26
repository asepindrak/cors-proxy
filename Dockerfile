FROM node:18-alpine AS base
WORKDIR /var/www

ARG PORT
ENV PORT=$PORT

COPY . .


RUN apk update && apk upgrade

RUN npm install

FROM base AS dev
WORKDIR /var/www
COPY --from=base /var/www .

CMD npm run dev

FROM base AS prod
WORKDIR /var/www
COPY --from=base /var/www/package.json .
COPY --from=base /var/www/package-lock.json .

ENTRYPOINT ["npm", "start"]