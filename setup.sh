#!/bin/bash
set -e

GREEN=$(tput setaf 2)
PINK=$(tput setaf 5)

echo "${PINK}Removing existing container and associated volumes..."

docker compose down -v

echo "${PINK} Building docker images ..."

# Build docker images
docker-compose build

# Spring up docker containers in detached mode
docker-compose up -d --force-recreate

echo "${PINK}Running migrations on production ..."

docker-compose exec production_app npx sequelize-cli db:migrate

echo "${PINK}Running migrations on test ..."

docker-compose exec test_app npx sequelize-cli db:migrate

echo "${GREEN} Application dockerized and started"