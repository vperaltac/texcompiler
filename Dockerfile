FROM node:13-buster

WORKDIR /usr/src/texcompiler

# Instalación de TexLive
COPY scripts ./scripts/
RUN ./scripts/texlive_install.sh

# Instalación de RabbitMQ
RUN apt-get update
RUN apt-get install software-properties-common -y
RUN add-apt-repository 'http://www.rabbitmq.com/debian/'
RUN apt-get install rabbitmq-server -y
RUN rabbitmq-plugins enable rabbitmq_management rabbitmq_management_agent

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

EXPOSE $PORT

RUN chmod a+x scripts/start.sh
CMD ./scripts/start.sh