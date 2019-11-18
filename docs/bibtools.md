<!-- bibtools.md -->

# Bibliotecas y herramientas utilizadas
Todas las bibliotecas se encuentran listadas en el archivo `package.json`:
```
...
  "dependencies": {
    "amqplib": "^0.5.5",
    "core-util-is": "^1.0.2",
    "express": "^4.17.1",
    "express-fileupload": "^1.1.6-alpha.6",
    "nyc": "^14.1.1",
    "unique-filename": "^1.1.1"
  },
  "devDependencies": {
    "apidoc": "^0.18.0",
    "chai": "^4.2.0",
    "docco": "^0.8.0",
    "grunt": "^1.0.4",
    "grunt-apidoc": "^0.11.0",
    "grunt-cli": "^1.3.2",
    "grunt-contrib-clean": "^2.0.0",
    "grunt-docco": "^0.5.0",
    "grunt-run": "^0.8.1",
    "mocha": "^6.2.1",
    "mocha-sinon": "^2.1.0",
    "nodemon": "^1.19.4",
    "pm2": "^4.1.2",
    "sinon": "^7.5.0",
    "sinon-chai": "^3.3.0",
    "supertest": "^4.0.2"
  }
...

```
Si quieres saber más sobre las herramientas de testeo utilizadas dirigete a la [documentación sobre tests](tests.md).

A continuación añado una justificación de cada biblioteca utilizada.

## Docco
He utilizado Docco para generar la documentación del código en formato HTML de forma automática. Ésta biblioteca genera documentación a partir de los comentarios que encuentre en los archivos del proyecto.
Se puede ver [aquí](https://victorperalta93.github.io/IV-Proyecto/docco/texCompiler.html).

## nodemon
Arranca la aplicación de Express y reinicia el servicio cada vez que se realiza alguna modificación al código del proyecto. Hace el desarrollo inicial de la aplicación muy cómodo. Cuando la aplicación empiece a ser más compleja, PM2 puede ser una solución más completa.

## PM2
Gestor de procesos muy potente capaz de lanzar múltiples instancias de la aplicación a la vez. Permite arrancar y parar procesos de forma fácil y rápida. También incluye un sistema de logging. Incluso es capaz de reiniciar un proceso asegurando de que esté en servicio todo el tiempo. En la documentación sobre [herramientas de construcción](tools_construccion.md) se indican los diferentes comandos definidos en Grunt para aprovechar esta herramienta. 

## amqplib
Biblioteca que utiliza el estándar [AMQP](https://es.wikipedia.org/wiki/Advanced_Message_Queuing_Protocol) de sistema de comunicación. Es un componente necesario para que RabbitMQ funcione con NodeJS.

## apidoc

Genera documentación sobre una API REST implementada, tiene su sintaxis propia similar a doxygen. Muy útil para ahorrar tiempo en documentación. Se puede ver el resultado de esta operación [aquí](https://victorperalta93.github.io/IV-Proyecto/apidoc/index.html).

# Herramientas de Test utilizadas
## Chai
Chai es una biblioteca de aserciones para node. La he utilizado junto a Mocha para realizar tests sobre la biblioteca desarrollada hasta el momento.

## Mocha
Mocha es un framework de pruebas para node. Junto a chai se convierte en una herramienta muy útil para realizar tests sobre las bibliotecas y clases de nuestro proyecto. Mocha proporciona una sintaxis muy legible y fácil de leer aunque no se esté muy familiarizado con la herramienta.

## Sinon
Biblioteca muy conocida para hacer mocks en NodeJS. En mi caso, la he utilizado para "espiar" las salidas por la consola y así poder utilizar las mismas en los tests.

## istanbul (nyc)
El objetivo principal del uso de esta herramienta es generar información sobre la cobertura de código de mi proyecto.
>Aviso: las versiones de esta biblioteca son muy confusas, ya que su versión antigua (deprecated) se llama istanbul. Si quieres utilizarla debes instalar __nyc__.

## Supertest
Biblioteca para realizar tests a traves de HTTP. Muy útil para hacer tests de integración a la app desarrollada con Express.
