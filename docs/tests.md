## Chai
Chai es una biblioteca de aserciones para node. La he utilizado junto a Mocha para realizar tests sobre la biblioteca desarrollada hasta el momento.

## Mocha
Mocha es un framework de pruebas para node. Junto a chai se convierte en una herramienta muy útil para realizar tests sobre las bibliotecas y clases de nuestro proyecto. En mi caso, los tests realizados son los siguientes:

```
describe('TexCompiler', function(){
    it('Debería cargar la biblioteca y poder instanciarse',function(){
        texCompiler.should.exist
    })

    it('Debería informar de que el archivo tiene una extensión errónea',function(){
        expect(texCompiler('ejemplo.tar',false)).to.equal('Formato incorrecto.')
    })

    it('Debería informar de que recibe un archivo que no existe',function(){
        expect(texCompiler('archivo_fantasma.tex',false)).to.equal('Archivo no encontrado.')
    })

    it('Debería confirmar que la ejecución ha sido correcta.',function(){
        expect(texCompiler('ejemplo.tex',false)).to.equal('Archivo creado con éxito.')
    })
})
```

Mocha proporciona una sintaxis muy legible y fácil de leer aunque no se esté muy familiarizado con la herramienta. Estos tests se ejecutan tanto con `grunt test` como `npm test`. Aunque siempre recomiendo el primero.
