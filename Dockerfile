#Multi stage build for production and test

#production
FROM node:14 as production

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g typescript

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npx", "nodemon", "/app/src/server.ts"]


#test
FROM node:14 as test

WORKDIR /test

ENV NODE_ENV=test

RUN npm install -g typescript

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npx", "nodemon", "/test/src/server.ts"]