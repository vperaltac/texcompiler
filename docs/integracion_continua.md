<!-- _integracion_continua.md -->

# Integración Continua
La integración continua permite automatizar el testeo de un proyecto en un entorno controlado y con una configuración específica.

## Integración continua con Travis CI
Utilizar Travis CI para nuestro proyecto es fácil y rápido, basta con crear una cuenta en [su web](https://travis-ci.org) y activarlo en el repositorio deseado. Este proceso fue realizado en el [ejercicio 10 del tema 2](https://github.com/victorperalta93/IV-Ejercicios/blob/master/tema2.md).  
La configuración de Travis se define en un archivo `.travis.yml`. Mi archivo de configuración es el siguiente:

```
before_install:
    - sudo ./scripts/texlive_install.sh
    - PATH=/usr/local/texlive/2019/bin/x86_64-linux:$PATH; export PATH
language: node_js
node_js: 
    - "lts/*"
    - "node"

install:
    - npm ci
    - grunt doc

after_success:
    - grunt clean

directories:
    - "node_modules"
```

El parámetro `before_install` se utiliza para ejecutar algo antes de instalar las dependencias necesarias y ejecutar el build definido. En mi caso ejecuto un script para instalar la distribución TexLive y añado al PATH el mismo.
>__IMPORTANTE__: es necesario realizar el `export` del PATH dentro de la configuración, si se se hace en el script de instalación de TexLive, Travis no detectará cualquier comando de TexLive.

`language` sirve para definir el lenguaje de nuestro proyecto, en este caso node.js.

En `node_js` podemos indicar todas las versiones de node donde deseemos probar nuestro código. En mi caso, pruebo la versión Long Term Support (Actualmente es la v10) y la versión latest (v12 ahora mismo).

En el apartado `install` indico que quiero ejecutar la instalación de npm y generar la documentación con grunt. Para saber más sobre grunt puedes leer su apartado en la [documentación sobre bibliotecas y tests](bibtests.md).

>Aunque Travis ejecuta npm automáticamente, lo indico de forma manual porque quiero asegurar que la documentación se genera antes de lanzar los tests y se limpian los archivos generados después.

`after_success` solo se ejecuta si todas las pruebas se han ejecutado correctamente. Si es el caso, TexLive habrá generado archivos que elimino con `grunt clean`.

## Integración continua con CircleCI
La configuración con CircleCI se realiza ligeramente diferente, es necesario tener un directorio `.circleci` y dentro el archivo `config.yml`. La configuración para mi proyecto es la siguiente:

```
version: 2.1
jobs:
  build:
    docker:
      - image: circleci/node:10.16.3
    steps:
      - checkout
      - run: sudo ./scripts/texlive_install.sh
      - run: npm install
      - run: sudo npm install -g grunt-cli 
      - run: grunt doc
      - run: PATH=/usr/local/texlive/2019/bin/x86_64-linux:$PATH; export PATH; grunt test
```

`version` indica la versión de Circle-CI que utilizar.  
Utilizo la versión 10.16.3 de node, que actualmente es la LTS o Long Term Support.  
Cada orden de ejecución se indica en `steps` con el parámetro `run`.

Cabe mencionar que he necesitado ejecutar la actualización del PATH y `grunt test` en la misma linea para que detectase `pdflatex`. Imagino que cada linea se ejecuta en una instancia de terminal diferente.