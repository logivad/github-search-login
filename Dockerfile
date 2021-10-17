FROM node:14-stretch
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . ./
RUN npm run build:prod

FROM nginx:latest
COPY --from=0 /home/node/app/dist/scalio /usr/share/nginx/html
