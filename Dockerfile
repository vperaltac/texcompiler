FROM node:13-buster

WORKDIR /usr/src/texcompiler

# Instalación de TexLive
COPY scripts ./scripts/
RUN ./scripts/texlive_install.sh

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

ENTRYPOINT grunt unit-test