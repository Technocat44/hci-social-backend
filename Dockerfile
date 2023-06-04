# Backend Dockerfile
FROM node:14-alpine
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
WORKDIR /app

COPY package*.json ./

RUN npm install --production && npm install -g cross-env && npm install shx

COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait


RUN apk add --no-cache openssl && apk add --no-cache libssl1.1


# Set the PRISMA_QUERY_ENGINE_BINARY environment variable

CMD /wait && npm run build && npm run push-schema && npm run migrate && npm run make-migrations && npm run develop

