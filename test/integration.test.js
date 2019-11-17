const app     = require('../src/index');
const chai    = require('chai');
const request = require('supertest');
const expect  = chai.expect;

describe('Express test', function(){
    it('should return STATUS: OK', function(done){
        request(app)
            .get('/status')
            .end(function(err,res){
                expect(res.body.status).to.be.ok;
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    it('should return pdf file compiled', function(done){
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
    })
});