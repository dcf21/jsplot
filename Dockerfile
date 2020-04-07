# Use Python 3.6 running on Debian Buster
FROM python:3.6-buster

# Install nginx
RUN apt-get update
RUN apt-get install -y nginx ; apt-get clean

# Copy code into container
WORKDIR /code
ADD build build
ADD src src
ADD demo demo

# Produce distributable version of demos
RUN /code/build/build.py

# Serve demos
RUN rm -Rf /var/www/html ; ln -s /code/dist /var/www/html

# Enable index in nginx
RUN echo "autoindex on;\n$(cat /etc/nginx/sites-available/default)" > /etc/nginx/sites-available/default

# Expose port 80 (http)
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
