FROM nginx:stable-alpine
WORKDIR /app
COPY /build /var/www/
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80