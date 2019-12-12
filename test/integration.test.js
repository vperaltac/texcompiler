const app     = require('../src/index');
const chai    = require('chai');
const request = require('supertest');
const expect  = chai.expect;

require('../src/worker');

describe('Tests de integración', function(){
    describe('GET', function(){
        it('debería devolver la página de inicio', function(done){
            request(app)
                .get('/')
                .end(function(err,res){
                    expect(res.statusCode).to.equal(200);
                    expect('Content-Type','text/html');
                    done();
                });
        });    

        it('debería devolver Status: OK', function(done){
            request(app)
                .get('/status')
                .end(function(err,res){
                    expect(res.body.status).to.be.ok;
                    expect(res.statusCode).to.equal(200);
                    done();
                });
        });    

        //GET  /tex/:nombre/:usuario
        it('deberia devolver el archivo tex solicitado', function(done){
            request(app)
                .get('/tex/ejemplo/test_user')
                .end(function(err,res){
                    expect(res.statusCode).to.equal(200);
                    expect('Content-Type','application/x-tex');
                    done();
                });
        });

        it('deberia informar si no encuentra el archivo', function(done){
            request(app)
                .get('/tex/ejemplo_falso/test_user')
                .end(function(err,res){
                    expect(res.text).to.equal('Archivo no encontrado.');
                    done();
                });
        });

        //GET  /pdf/:nombre/:usuario
        it('deberia devolver el archivo pdf solicitado', function(done){
            request(app)
                .get('/pdf/ejemplo/test_user')
                .end(function(err,res){
                    expect(res.statusCode).to.equal(200);
                    expect('Content-Type','application/pdf');
                    done();
                });
        });

        //GET /listar-tex/:usuario
        it('deberia devolver una lista de los archivos tex del usuario dado', function(done){
            request(app)
                .get('/listar-tex/test_user')
                .expect(200)
                .expect('Content-Type',/json/)
                .end(function(err,res){
                    if(err) return done(err);
                    done();
                });
        });

        //GET /listar-pdf/:usuario
        it('deberia devolver una lista de los archivos PDF del usuario dado', function(done){
            request(app)
                .get('/listar-pdf/test_user')
                .expect(200)
                .expect('Content-Type',/json/)
                .end(function(err,res){
                    if(err) return done(err);
                    done();
                });
        });

        //GET /listar/:usuario
        it('deberia devolver una lista de todos los archivos del usuario dado', function(done){
            request(app)
                .get('/listar/test_user')
                .expect(200)
                .expect('Content-Type',/json/)
                .end(function(err,res){
                    if(err) return done(err);
                    done();
                });
        });

        //GET /listar
        it('deberia devolver una lista de todos los archivos en el servidor', function(done){
            request(app)
                .get('/listar')
                .expect(200)
                .expect('Content-Type',/json/)
                .end(function(err,res){
                    if(err) return done(err);
                    done();
                });
        });
    });

    describe('POST', function(){
        it('debería avisar si no existe archivo fuente', function(done){
            request(app)
                .post('/tex/test_user')
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(400);
                    expect('Content-Type','text/html');
                    expect(res.text).to.equal('No se encontró el archivo fuente.');
                    done();
                  });
        });
    
        it('debería avisar si el nombre es incorrecto', function(done){
            request(app)
                .post('/tex/test_user')
                .set('Content-Type','application/x-www-form-urlencoded')
                .attach('nombre_incorrecto', 'data/test_user/src/ejemplo.tex')
                .end(function(err,res){
                    expect(res.statusCode).to.equal(400);
                    expect('Content-Type','text/html');
                    expect(res.text).to.equal('Nombre incorrecto.');
                    done();
                });
        });
    
        it('debería avisar de que se envió la petición', function(done){
            request(app)
                .post('/tex/test_user')
                .set('Content-Type','application/x-www-form-urlencoded')
                .attach('documento', 'data/test_user/src/ejemplo.tex')
                .end(function(err,res){
                    expect(res.statusCode).to.equal(200);
                    expect('Content-Type','text/html');
                    expect(res.text).to.equal('Archivo subido. El PDF se generará en breve.');
                    done();
                });
        });

        it('debería funcionar correctamente con un nuevo usuario', function(done){
            request(app)
                .post('/tex/nuevo')
                .set('Content-Type','application/x-www-form-urlencoded')
                .attach('documento', 'data/test_user/src/ejemplo.tex')
                .end(function(err,res){
                    expect(res.statusCode).to.equal(200);
                    expect('Content-Type','text/html');
                    expect(res.text).to.equal('Archivo subido. El PDF se generará en breve.');
                    done();
                });
        });
    });

    describe('DELETE', function(){
        // DELETE /pdf/:nombre/:usuario
        it('debería eliminar un pdf de un usuario', function(done){
            request(app)
                .delete('/pdf/ejemplo/test_delete')
                .end(function(err,res){
                    expect(res.statusCode).to.equal(200);
                    expect(res.text).to.equal('Archivo eliminado.');
                    done();
                });
        });

        // DELETE /tex/:nombre/:usuario
        it('debería eliminar un pdf de un usuario', function(done){
            request(app)
                .delete('/tex/ejemplo/test_delete')
                .end(function(err,res){
                    expect(res.statusCode).to.equal(200);
                    expect(res.text).to.equal('Archivo eliminado.');
                    done();
                });
        });
    });

    setTimeout(function() {
        process.exit(1);
    }, 10000);
});