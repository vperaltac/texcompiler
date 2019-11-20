const chai = require('chai');
const expect = chai.expect;
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

    it('Debería confirmar que la ejecución ha sido correcta.', async() => {
        const ret = await texCompiler('doc/ejemplo.tex',false);
        expect(ret).to.equal(true);
        expect(console.log.calledWith('Archivo creado con éxito.')).to.be.true;
    })

    it('Deberia avisar de que hubo un error en compilación.',async() => {
        const ret = await texCompiler('doc/ejemplo_error.tex',false);
        expect(ret).to.equal(false);
        expect(console.log.calledWith('Error en compilación. Leer .log para más información')).to.be.true;
    })

    it('Debería mostrar la salida de pdflatex si así se le indica.', async() => {
        const ret = await texCompiler('doc/ejemplo.tex',true);
        expect(ret).to.equal(true);
        expect(console.log.calledWithMatch('This is pdfTeX')).to.be.true;
    })
})