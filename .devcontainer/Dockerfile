FROM node:24.1.0-slim as deps
RUN apt update && apt install python3 protobuf-compiler build-essential gettext git -y

WORKDIR /workspace

COPY package*.json ./
COPY lerna*.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY libs ./libs

# Provide kubectl for k8s development
RUN apt update && apt install -y curl ca-certificates && curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && rm kubectl

RUN npm install
