const should      = require("chai").should()
const expect      = require("chai").expect
const texCompiler = require('../src/texCompiler')

describe('TexCompiler', function(){
    it('Debería cargar la biblioteca y poder instanciarse',function(){
        texCompiler.should.exist
    })

    it('Debería informar de que recibe un archivo que no existe',function(){
        expect(texCompiler('archivo_fantasma.tex',false)).to.equal('Archivo no encontrado.')
    })

    it('Debería informar de que el archivo tiene una extensión errónea',function(){
        expect(texCompiler('ejemplo.tar',false)).to.equal('Formato incorrecto.')
    })

    it('Debería confirmar que la ejecución ha sido correcta.',function(){
        expect(texCompiler('ejemplo.tex',false)).to.equal('Archivo creado con éxito.')
    })
})