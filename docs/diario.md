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