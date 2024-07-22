#!/bin/bash
set -e

GREEN=$(tput setaf 2)
PINK=$(tput setaf 5)

echo "${PINK}Building docker images ..."

# Build docker images
docker-compose build

# Spring up docker containers in detached mode
docker-compose up -d --force-recreate

echo "${PINK}Running migrations ..."

docker-compose exec app npx sequelize-cli db:migrate

echo "${GREEN} Application dockerized and started"