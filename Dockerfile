FROM node:10

WORKDIR /var/app/hgs

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
