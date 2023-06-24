FROM node:alpine
COPY . /frontend
WORKDIR /frontend
RUN npm install
# RUN npm run dev
EXPOSE 3000
CMD npm run dev