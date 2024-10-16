FROM node:18-alpine
COPY . /opt/app
WORKDIR /opt/app
RUN npm install --omit=dev
RUN npm run build
CMD ["npm", "run", "start"]