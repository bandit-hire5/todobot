FROM node:16-buster

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN chown node:node /usr/src

USER node

WORKDIR /usr/src

COPY --chown=node:node . .

RUN npm install && npm run build

ENV NODE_ENV=production

CMD npm start