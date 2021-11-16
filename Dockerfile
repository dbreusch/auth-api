FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm install

# if you want to use nodemon as the CMD, needs to be installed
RUN npm i -g nodemon

COPY . .

EXPOSE 8080

# use node for "production" and nodemon for "development"
# CMD [ "node", "auth-app.js" ]
CMD [ "nodemon", "auth-app.js" ]
