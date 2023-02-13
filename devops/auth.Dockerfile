FROM node:16.13

WORKDIR /main
COPY ./server/auth.js /main
RUN mkdir /main/models
COPY ./server/models/user.js /main/models
COPY ./package.json /main
COPY ./package-lock.json /main

RUN npm install

EXPOSE 7000

CMD ["node", "auth.js"]