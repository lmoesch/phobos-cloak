FROM node:22.4.1 AS webapp

RUN apt update && apt install protobuf-compiler -y 

WORKDIR /opt/phobos-cloak/webapp

# Install webapp source dependancies
COPY ./webapp/*.json ./
RUN npm install

# Build webapp
COPY ./webapp/lib ./lib
COPY ./webapp/src ./src
COPY ./protocol ../protocol

RUN npm run proto:generate
RUN npm run build

FROM node:22.4.1 AS server
ENV TZ="Europe/Berlin"

RUN apt update && apt install protobuf-compiler alsa-utils libasound2-dev -y 

EXPOSE 3100
WORKDIR /opt/phobos-cloak/server

# Install server source dependancies
COPY ./server/*.json ./
RUN npm install

# Build server
COPY ./server/src ./src
COPY ./server/lib ./lib
COPY ./protocol ../protocol

RUN npm run proto:generate

# Get webapp artifact
COPY --from=webapp /opt/phobos-cloak/webapp/dist/phobos-cloak/browser ./dist/public

# Run startscript
CMD npm run start
