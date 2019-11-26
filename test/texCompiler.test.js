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
        var datos = {
            nombre: 'ejemplo.tar',
            usuario: 'test_user',
            fuente: 'data/test_user/src/ejemplo.tar'
        };

        texCompiler(datos,false);
        expect(console.log.calledWith('Formato incorrecto.')).to.be.true;
    })

    it('Debería informar de que recibe un archivo que no existe',function(){
        var datos = {
            nombre: 'archivo_fantasma.tex',
            usuario: 'test_user',
            fuente: 'data/test_user/src/archivo_fantasma.tex'
        };

        texCompiler(datos,false);
        expect(console.log.calledWith('Archivo no encontrado.')).to.be.true;
    })

    it('Debería confirmar que la ejecución ha sido correcta.', async() => {    
        var datos = {
            nombre: 'ejemplo.tex',
            usuario: 'test_user',
            fuente: 'data/test_user/src/ejemplo.tex'
        };

        const ret = await texCompiler(datos,false);
        expect(ret).to.equal(true);
        expect(console.log.calledWith('Archivo creado con éxito.')).to.be.true;
    })

    it('Deberia lanzar una excepción si hubo un error en compilación.',async() => {
        var datos = {
            nombre: 'ejemplo.tex',
            usuario: 'test_user',
            fuente: 'data/test_user/src/ejemplo.tex'
        };

        expect(await texCompiler(datos,true)).to.throw;
    })

    it('Debería mostrar la salida de pdflatex si así se le indica.', async() => {
        var datos = {
            'nombre': 'ejemplo.tex',
            'usuario': 'test_user',
            'fuente': 'data/test_user/src/ejemplo.tex'
        };

        const ret = await texCompiler(datos,true);
        expect(ret).to.equal(true);
        expect(console.log.calledWithMatch('This is pdfTeX')).to.be.true;
    })

    it('Debería avisar de que la compilación dió error.', async() => {
        var datos = {
            'nombre': 'ejemplo_error.tex',
            'usuario': 'test_user',
            'fuente': 'data/test_user/src/ejemplo_error.tex'
        };

        const ret = await texCompiler(datos,false);
        expect(ret).to.equal(false);
        expect(console.log.calledWithMatch('Error en compilación. El PDF no ha sido generado.')).to.be.true;
    })
})