const chai = require('chai');
const expect = chai.expect;
const should = require('chai').should
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const texCompiler = require('../src/texCompiler');

chai.use(sinonChai);

// Tests unitarios para la biblioteca que realiza la compilación LaTeX.
// Las comprobaciones realizadas hasta el momento son:
//  * Carga e instanciación de biblioteca
//  * Manejo de archivos con extensión errónea
//  * Manejo de archivos no existentes
//  * Confirmación de ejecución correcta
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