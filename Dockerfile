FROM php:8.4-apache-bookworm

WORKDIR /var/www/html

# Instalando las dependencias para poder usar postgresql
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Copiando el proyecto desde la raiz hacia el WORKDIR
COPY . .

# Instalando composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiando las variables de entorno de Laravel
COPY .env .env

# Copiando el paquete de dependencias de npm
COPY package.json package-lock.json* ./

# Instalando las dependencias para la aplicacion de laravel
RUN composer install

# Instalando node
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install 22 \
    npm install

# Exponiendo puertos necesarios (8000 Laravel App) (5173 Vite App)
EXPOSE 8000
EXPOSE 5173

CMD "composer" "run" "dev"

