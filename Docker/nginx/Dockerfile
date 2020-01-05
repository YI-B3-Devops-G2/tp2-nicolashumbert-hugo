FROM nginx:1.17.6-alpine
ENV NGINX_PORT 80
ENV HOSTNAME docker

RUN rm -fr /etc/nginx/conf.d/default.conf
COPY conf.d/* /etc/nginx/conf.d/