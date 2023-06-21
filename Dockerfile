FROM node:alpine
COPY . /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build
EXPOSE 3000
CMD npm run start 
# CMD npm run dev