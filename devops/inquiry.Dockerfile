FROM node:16.13

WORKDIR /main
COPY ./server/inquiry.js /main
RUN mkdir /main/models
COPY ./server/models/inquiry.js /main/models
COPY ./server/models/response.js /main/models
COPY ./package.json /main
COPY ./package-lock.json /main

RUN npm install

EXPOSE 9000

CMD ["node", "inquiry.js"]