FROM node:16

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .

EXPOSE 3000

CMD npm start
