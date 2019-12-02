FROM node:13-buster

WORKDIR /app

# Instalación de TexLive
COPY scripts ./scripts/
RUN ./scripts/texlive_install.sh

# Instalación de RabbitMQ
RUN apt-get update
RUN apt install openssh-server -y

COPY package*.json ./

# instalar dependencias
RUN npm install
RUN npm install -g grunt-cli
RUN npm install pm2 -g

COPY views ./views/
COPY src ./src/
COPY data ./data/
COPY ecosystem.config.js ./
COPY Gruntfile.js ./

ADD ./.profile.d /app/.profile.d

EXPOSE $PORT

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN chmod a+x scripts/start.sh

CMD bash .profile.d/heroku-exec.sh && ./scripts/start.sh