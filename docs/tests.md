<!-- _tests.md -->
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

## Tests Unitarios

Los tests unitarios del proyecto son los siguientes:
```
describe('Tests unitarios para TexCompiler', function(){
    beforeEach(function() {
        sinon.spy(console, 'log');
    });
    
    afterEach(function() {
        console.log.restore();
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

    it('Debería confirmar que la ejecución ha sido correcta.',function(done){
        texCompiler('ejemplo.tex',false);
        done();
        expect(console.log.calledWith('Archivo creado con éxito.')).to.be.true;
    })
})
```

Para ejecutar los tests puedes utilizar:
* Tests unitarios: `grunt unit-test`
* Tests de integración `grunt int-test`


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