FROM node:20
ENV NODE_ENV=production \
    npm_config_update_notifier=false
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY . .
RUN chown -R node:node /app
USER node
EXPOSE 8080
CMD ["npm", "start"]