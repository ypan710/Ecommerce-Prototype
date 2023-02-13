FROM node:16.13

WORKDIR /main
COPY ./server/listing.js /main
RUN mkdir /main/models
COPY ./server/models/listing.js /main/models
COPY ./server/models/resize.js /main/models
COPY ./package.json /main
COPY ./package-lock.json /main

RUN npm install

EXPOSE 8000

CMD ["node", "listing.js"]