FROM node:18

# Create app directory
WORKDIR /usr/src/app



COPY package*.json ./
COPY keycloak.json ./



RUN npm install
run npm audit --force

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]


