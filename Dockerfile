FROM node:alpine
COPY . /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build
EXPOSE 3000
# CMD npm run dev
CMD npm run start