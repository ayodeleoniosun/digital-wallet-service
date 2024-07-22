FROM node:14 as base

WORKDIR /app

RUN npm install -g typescript

RUN npm install -g sequelize-cli

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npx", "nodemon", "/app/src/server.ts"]