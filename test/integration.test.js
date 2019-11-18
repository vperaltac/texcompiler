const app     = require('../src/index');
const chai    = require('chai');
const request = require('supertest');
const expect  = chai.expect;

describe('Tests de integración', function(){
    it('debería devolver Status: OK', function(done){
        request(app)
            .get('/status')
            .end(function(err,res){
                expect(res.body.status).to.be.ok;
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

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
});