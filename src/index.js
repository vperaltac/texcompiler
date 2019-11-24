// La conexión con el servidor RabbitMQ se ha basado en el tutorial que proponen en su web
// titulado: RPC. Link: https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html

const express        = require('express');
const fileUpload     = require('express-fileupload');
const amqp           = require('amqplib/callback_api');
const files          = require('./files');
const app            = express();

// Nombre de la cola de RabbitMQ
const queue = 'compiler_queue';

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload());

/**
 * @api {get} /status Devuelve OK si el servicio está disponible
 * @apiName getStatus
 * @apiGroup test
 *
 * @apiSuccess {json} Status: OK
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": "OK"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */
app.get('/status',(req,res) => {
    res.status(200).json({status: 'OK'})
});

/**
 * @api {get} /tex/:nombre/:usuario 
 * @apiName getTexFile
 * @apiGroup Subida y bajada de archivos
 * 
 * @apiParam {String} nombre Nombre del archivo
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {File} archivo TEX
 */
app.get('/tex/:nombre/:usuario',(req,res) => {
    let path = files.getTexPath(req.params.nombre,req.params.usuario);

    if(path === false)
        res.send("Archivo no encontrado.");
    else
        res.download(path);
});

/**
 * @api {get} /listar-tex/:usuario
 * @apiName listarTex
 * @apiGroup listado de archivos en el servidor
 * 
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {json} archivos tex del usuario dado en el servidor.
 */
app.get('/listar-tex/:usuario',(req,res) => {
    let listado = files.listarArchivos(req.params.usuario,true,false);

    res.send(listado);
});

/**
 * @api {get} /listar-pdf/:usuario
 * @apiName listarPDF
 * @apiGroup listado de archivos en el servidor
 * 
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {json} archivos PDF del usuario dado en el servidor.
 */
app.get('/listar-pdf/:usuario', (req,res) => {
    let listado = files.listarArchivos(req.params.usuario,false,true);

    res.send(listado);
});

/**
 * @api {get} /listar/:usuario
 * @apiName listar
 * @apiGroup listado de archivos en el servidor
 * 
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {json} todos los archivos del usuario dado en el servidor.
 */
app.get('/listar/:usuario', (req,res) => {
    let listado = files.listarArchivos(req.params.usuario,true,true);
    
    res.send(listado);
});

/**
 * @api {get} /listar/:usuario
 * @apiName listarTodos
 * @apiGroup listado de archivos en el servidor
 *
 * @apiSuccess {json} todos los archivos de todos los usuarios en el servidor.
 */
app.get('/listar', (req,res) => {
    let todos = files.listarTodos();

    res.send(todos);
});

/**
 * @api {delete} /tex/:nombre/:usuario
 * @apiName eliminarTex
 * @apiGroup eliminar Archivos
 * 
 * @apiParam {String} nombre Nombre del archivo
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {String} mensaje confirmando que el archivo ha sido eliminado.
 */
app.delete('/tex/:nombre/:usuario', (req,res) => {
    files.eliminarTex(req.params.nombre,req.params.usuario);

    res.send("Archivo eliminado.");
});

/**
 * @api {delete} /tex/:nombre/:usuario
 * @apiName eliminarPDF
 * @apiGroup eliminar Archivos
 * 
 * @apiParam {String} nombre Nombre del archivo
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {String} mensaje confirmando que el archivo ha sido eliminado.
 */
app.delete('/pdf/:nombre/:usuario', (req,res) => {
    files.eliminarPDF(req.params.nombre,req.params.usuario);

    res.send("Archivo eliminado.");
});

/**
 * @api {post} /compilar Compila un archivo en formato TEX a un documento PDF
 * @apiName postCompilar
 * @apiGroup main
 *
 * @apiSuccess {File} documento PDF resultado de la compilación
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiError FileNotFound No se encontró el archivo fuente.
 * @apiError WrongName Nombre incorrecto.
 * @apiErrorExample {String} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *      String indicando error
 */
app.post('/tex/:usuario', (req,res) => {
    if(!req.files)
        return res.status(400).send('No se encontró el archivo fuente.');
    
    if(!req.files.documento)
        return res.status(400).send('Nombre incorrecto.');

    let documento = req.files.documento;
    let nombre = req.files.documento.name;
    let destino = 'data/' + req.params.usuario + "/src/" + nombre;

    var datos = [{
        nombre: nombre,
        usuario: req.params.usuario,
        fuente: destino
    }];

    documento.mv(destino, function(err){
        if(err)
            return res.status(500).send(err);
        
        amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) 
                throw error0;

            connection.createChannel(function(error1, channel) {
                if (error1)
                    throw error1;
                
                console.log("Enviando petición de compilar...");
                channel.assertQueue(queue, {
                    durable: true
                });

                // envío por la cola `queue` del nombre de archivo a compilar
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(datos)), {
                    persistent: true
                });

                res.send("Archivo subido. El PDF se generará en breve.");
            });
        });
    });
});

app.listen(PORT, () => console.log(`Servidor iniciado en puerto: ${PORT}`));
module.exports = app;