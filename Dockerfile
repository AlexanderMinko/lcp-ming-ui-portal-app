#FROM node:14.17.5 AS build
#WORKDIR /app
#COPY package.json package-lock.json ./
#RUN npm install
#RUN npm install -g @angular/cli@12.2.13
#RUN npm install --save-dev @angular-devkit/build-angular
#RUN npm audit fix
#COPY . .
#RUN npm run build --prod

FROM nginx:alpine
COPY dist/lcp-ming-ui-portal-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["sh","-c","sed -i 's|{KEYCLOAK_URL}|'$KEYCLOAK_URL'|g' /usr/share/nginx/html/main*.js  && \
                sed -i 's|{API_URL}|'$API_URL'|g' /usr/share/nginx/html/main*.js && \
                sed -i 's|{MINIO_URL}|'$MINIO_URL'|g' /usr/share/nginx/html/main*.js && \
                sed -i 's|{APP_URL}|'$APP_URL'|g' /usr/share/nginx/html/main*.js && \
                nginx -g 'daemon off;'"]
