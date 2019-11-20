<!-- tests.md -->
## Tests de Integración e Historias de Usuario
Las historias de usuario cubiertas hasta el momento son las siguiente:
* Dada una cadena de texto devuelve status OK y una lista vacía 
* Dada una petición vacía entonces devuelve el estado 400 y una cadena de texto indicando que no se encontró el archivo fuente.
* Dado un archivo con un nombre incorrecto entonces devuelve el estado 400 y una cadena de texto indicando que el nombre asignado no es correcto.
* Dado un archivo en formato TEX y con nombre asignado documento entonces devuelve un archivo en formato PDF y el estado 200.


El primer test prueba la dirección `/status`. Sirve para comprobar que el servicio está disponible.  

Historia de usuario: Dada una cadena de texto devuelve status OK y una lista vacía 
```
it('debería devolver Status: OK', function(done){
    request(app)
        .get('/status')
        .end(function(err,res){
            expect(res.body.status).to.be.ok;
            expect(res.statusCode).to.equal(200);
            done();
        });
});

```

Historia de usuario: Dada una petición vacía entonces devuelve el estado 400 y una cadena de texto indicando que no se encontró el archivo fuente.
```
it('debería avisar si no existe archivo fuente', function(done){
    request(app)
        .post('/compilar')
        .end(function(err, res) {
            expect(res.statusCode).to.equal(400);
            expect('Content-Type','text/html');
            expect(res.text).to.equal('No se encontró el archivo fuente.');
            done();
            });
});
```

Historia de usuario: Dado un archivo con un nombre incorrecto entonces devuelve el estado 400 y una cadena de texto indicando que el nombre asignado no es correcto.

```
it('debería avisar si el nombre es incorrecto', function(done){
    request(app)
        .post('/compilar')
        .set('Content-Type','application/x-www-form-urlencoded')
        .attach('nombre_incorrecto', 'doc/ejemplo.tex')
        .end(function(err,res){
            expect(res.statusCode).to.equal(400);
            expect('Content-Type','text/html');
            expect(res.text).to.equal('Nombre incorrecto.');
            done();
        });
});
```

Historia de usuario: Dado un archivo en formato TEX y con nombre asignado documento entonces devuelve un archivo en formato PDF y el estado 200.
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

Para saber más sobre este último test, puedes leer el apartado "Testeando con supertest y RabbitMQ" del [diario de desarrollo](diario.md).


## Tests Unitarios

Los tests unitarios del proyecto son los siguientes:
```
describe('Tests unitarios para TexCompiler', function(){
    beforeEach(function() {
        sinon.spy(console, 'log');
        sinon.spy(console, 'error');
    });
    
    afterEach(function() {
        console.log.restore();
        console.error.restore();
    });

    it('Debería cargar la biblioteca y poder instanciarse',function(){
        expect(texCompiler).to.exist
    })

    it('Debería informar de que el archivo tiene una extensión errónea',function(){
        texCompiler('ejemplo.tar',false);
        expect(console.log.calledWith('Formato incorrecto.')).to.be.true;
    })

    it('Debería informar de que recibe un archivo que no existe',function(){
        texCompiler('archivo_fantasma.tex',false);
        expect(console.log.calledWith('Archivo no encontrado.')).to.be.true;
    })

    it('Debería confirmar que la ejecución ha sido correcta.', async() => {
        const ret = await texCompiler('doc/ejemplo.tex',false);
        expect(ret).to.equal(true);
        expect(console.log.calledWith('Archivo creado con éxito.')).to.be.true;
    })

    it('Deberia lanzar una excepción si hubo un error en compilación.',async() => {
        expect(await texCompiler('doc/ejemplo_error.tex',true)).to.throw;
    })

    it('Debería mostrar la salida de pdflatex si así se le indica.', async() => {
        const ret = await texCompiler('doc/ejemplo.tex',true);
        expect(ret).to.equal(true);
        expect(console.log.calledWithMatch('This is pdfTeX')).to.be.true;
    })
})
```

Para ejecutar los tests puedes utilizar:
* Tests unitarios: `grunt unit-test`
* Tests de integración `grunt int-test`

Si quieres saber más sobre los tests unitarios, puedes leer la sección Testeando código asíncrono de mi [diario de desarrollo]((diario.md)).

## Documentación de tareas
Para implementar el sistema de mensajería he utilizado el patrón _Remote Procedure Call_ o _RPC_. Es perfecto para mi aplicación ya que no solo envía el mensaje si no que recibe una respuesta cuando la tarea ha finalizado.
La idea principal es que en cada petición se abre un canal anónimo `callback`. Se informa de dicho canal al receptor para que cuando termine la tarea lo utilice para informar de ello.

La tarea principal sigue el siguiente recorrido:

Primero el cliente abre una conexión con `amqp`, crea un canal y crea una cola con nombre aleatorio.

```
...
amqp.connect('amqp://localhost', function(error0, connection) {
    ...
    connection.createChannel(function(error1, channel) {
        ...
        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
        ...
... 
```
A continuación, se envía a través de la cola `compiler_queue` el mensaje.

```
channel.sendToQueue(queue,
    Buffer.from(destino), {
        correlationId: correlationId,
        replyTo: q.queue
    });

```
El servidor (o worker) recibe el mensaje y comienza la compilación del archivo
```
channel.consume(queue, function reply(msg){
    let fuente = msg.content.toString();
    texCompiler(fuente,false)
```

Cuando la tarea ha finalizado, se envía la respuesta al canal anónimo que proporcionó el cliente.

```
channel.sendToQueue(msg.properties.replyTo,
    Buffer.from(pdf.toString()), {
        correlationId: msg.properties.correlationId
    });

channel.ack(msg);

```

Por último, el cliente recibe la respuesta y envía por la API REST el archivo PDF compilado.
```
channel.consume(q.queue, function(msg) {
    if (msg.properties.correlationId === correlationId){
        res.download(msg.content.toString());
    }
}, {
    noAck: true
});

```