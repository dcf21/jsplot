# Use Apache
FROM php:8.0-apache

# Install Python 3
RUN apt-get update
RUN apt-get install -y python3 ; apt-get clean

# Install nodejs (for demo website)
RUN apt-get install -y nodejs npm ; apt-get clean

# npm doesn't like running in /
WORKDIR /code

# Install Javascript minifier
RUN npm update
RUN npm install -g bower uglify-js less less-plugin-clean-css

# Copy code into container
WORKDIR /code
ADD build build
ADD src src
ADD website website

# Install demo website dependencies
ADD bower.json bower.json
ADD .bowerrc .bowerrc
RUN bower install

# Produce distributable version of website
RUN /code/build/build.py

# Enable required Apache modules
RUN ln -s /etc/apache2/mods-available/headers.load /etc/apache2/mods-enabled/
RUN ln -s /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/

# Serve demo website via Apache
RUN rm -Rf /var/www/html ; ln -s /code/dist /var/www/html

# Expose port 80 (http)
EXPOSE 80
