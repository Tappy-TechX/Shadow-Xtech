FROM node:lts-bullseye
RUN git clone https://github.com/Tappy-Black/Shadow-Xtech/root/shadowxtech
WORKDIR /root/shadowxtech
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1
COPY . .
EXPOSE 9090
CMD ["npm", "start"]
