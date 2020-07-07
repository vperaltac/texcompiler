<!-- diario.md -->

# Diario de desarrollo
En este documento quedará reflejado cualquier tema que vea oportuno comentar pero no encaje en ninguno de los otros apartados. Sirve a modo de documentación del desarrollo comentando decisiones tomadas que no hayan sido fáciles a lo largo del desarrollo del proyecto.

## REST API + RabbitMQ
La idea original del proyecto era desarrollarlo utilizando únicamente el sistema de mensajería RabbitMQ sin tener una API REST implementada. Sin embargo, después de investigar durante horas, las opciones para realizar tests de integración únicamente con RabbitMQ son muy escasas.  
Por tanto, para poder realizar los tests funcionales con herramientas sólidas, me decanté por implementar una API REST con la ayuda de Express y utilizarla así para realizar los tests que necesitara.

La idea principal de esta arquitectura es aislar el sistema de mensajería RabbitMQ exclusivamente de forma interna en el servidor. De esta forma es posible aprovechar las ventajas que aporta esta herramienta sin que la parte del cliente tenga que comunicarse mediante este canal.

Por consiguiente, una llamada típica comenzaría enviando una petición a la API REST, la cual activa el canal de mensajería de RabbitMQ y mediante el mismo pide compilar el archivo. Una vez hecho, dicho archivo se devuelve utilizando la API REST.

### Mocking
Existe la posibilidad de imitar el sistema de mensajería utilizando lo que se conoce como Mocking, (de hecho, encontré varios ejemplos de gente que hace esto) pero dichos tests (al menos en mi caso) ya se pasan mediante los tests unitarios implementados, por tanto los tests de integración prueba el servicio real.

## Testeando con supertest y RabbitMQ
El siguiente bloque de código incluye el último test de integración que se realiza. 
```
it('debería devolver el pdf compilado', function(done){
    request(app)
        .post('/compilar')
        .set('Content-Type','application/x-www-form-urlencoded')
        .attach('documento', 'doc/ejemplo.tex')
        .end(function(err,res){
            expect(res.statusCode).to.equal(200);
            expect('Content-Type', 'application/pdf')
            done();

            process.exit(0);
        });
});
```
Dicho test comprueba que el servicio web funciona correctamente, enviando un archivo con extensión TEX para ser compilado y recibiendo el PDF resultado. Esta prueba lanza el servicio de RabbitMQ, lo que causaba que los tests nunca terminaban porque el servicio no se cerraba. En los tutoriales que se ofrecen en la web de RabbitMQ se cierra el proceso del cliente (en mi caso ya es en la parte del servidor) una vez acaba la petición. Pero hacer esto provocaba que la aplicación se cerrara antes de que terminaran todos los tests debido a su naturaleza asíncrona. Por tanto, lo solucioné cerrando el proceso cuando terminan todos los tests. No es la forma más elegante, eso está claro, pero fue la única manera que funcionaba correctamente. Probé a cerrar el canal y la conexión que crea `amqp` pero no era suficiente.

## Testeando código asíncrono
Me gustaría hacer un pequeño resumen de mi proceso de desarrollo de test unitarios para código asíncrono.

Originalmente algunos de mis tests tenían esta pinta:

```
it('Debería confirmar que la ejecución ha sido correcta.',function(done){
    texCompiler('ejemplo.tex',false);
    done();
    expect(console.log.calledWith('Archivo creado con éxito.')).to.be.true;
})
```

Cómo mi función `texCompiler` era asíncrona, utilizaba `done` para esperar a que terminase y, una vez hecho, realizar el test oportuno. El test era correcto y yo (iluso de mí), pensaba que mi código estaba correctamente testeado.  
Algunos días después mientras intentaba mejorar la cobertura de mi código realice un test que tenía que fallar a propósito, y me di cuenta de que el test era correcto. Esto pasó porque mi test era __erróneo desde el principio__, parece que no soy el único que ha sufrido esto, lo llaman: ___evergreen_ test__.

El problema principal es que no se analizaba lo que ocurre después de `done()` y por tanto el test salía siempre correcto porque no testeaba nada!

### Async/Await con Mocha
Llegado a este punto, tenía que buscar una nueva solución para testear mi función asíncrona. Por suerte, Mocha permite utilizar async/await en sus test, haciendo el testeo de este tipo de funciones muy sencillo:
```
it('Debería confirmar que la ejecución ha sido correcta.', async() => {
    const ret = await texCompiler('doc/ejemplo.tex',false);
    expect(ret).to.equal(true);
    expect(console.log.calledWith('Archivo creado con éxito.')).to.be.true;
})
```
La sintaxis es clara, y esta vez sí realiza el test correctamente. Si hay que sacar alguna moraleja de este suceso, es que no viene mal probar que el test falle cuando tiene que fallar, en vez de seguir a otra cosa a la primera de cambio que sea correcto.

El siguiente artículo muestra varias formas de realizar tests cuando se trabaja con promesas: [How to Test Promises with Mocha](https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35).

## De RPC a Work Queues
Tras la corrección de la última entrega se me indicó que tendría sentido añadir una petición para eliminar archivos en mi servicio. La verdad, tiene sentido, pero con el modelo que estaba utilizando en la comunicación por mensajería no era tan sencillo añadir peticiones nuevas. Previamente solo existían 2 peticiones: GET status y POST compilar. La segunda se encargaba de recibir el documento LaTeX por la API REST, enviar la petición de compilar por el canal de mensajería de RabbitMQ y devolver el PDF generado como respuesta a la petición REST. Al hacerse todo en una sola operación añadir peticiones nuevas no tenía tanto sentido.
Por tanto decidí replantear el modelo de comunicación de la aplicación y utilizar _work queues_ en vez de _RPC_. Ésto permite varias cosas:
* Se pueden levantar N procesos que repartirán el trabajo de compilación en Round-Robin
* Se puede separar las peticiones para subir el documento tex (y enviar la petición de compilar) y descargar el documento PDF.
* Le da sentido a añadir peticiones nuevas para listar los documentos en el servicio y comprobar si se terminó la compilación.
* Le da sentido a peticiones para eliminar archivos

Y lo más importante de todo, aprovecha mejor la naturaleza asíncrona de RabbitMQ, permitiendo realizar la petición de compilar y no tener esperando al cliente.

Para ver la lista de peticiones en el sistema puedes consultar la [documentación de la API REST](https://vperaltac.github.io/texcompiler/apidoc/index.html).