// La conexión con el servidor RabbitMQ se ha basado en el tutorial que proponen en su web
// titulado: RPC. Link: https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html

const express        = require('express');
const fileUpload     = require('express-fileupload');
const uniqueFilename = require('unique-filename');
const amqp           = require('amqplib/callback_api');
const worker         = require('./worker');
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
app.get('/status',(req,res) =>{
    res.status(200).json({status: 'OK'})
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

app.post('/compilar',(req,res) =>{
    if(!req.files)
        return res.status(400).send('No se encontró el archivo fuente.');

    if(!req.files.documento)
        return res.status(400).send("Nombre incorrecto.");

    let documento = req.files.documento;
    let destino = uniqueFilename('doc') + ".tex";

    documento.mv(destino, function(err) {
        if (err)
            return res.status(500).send(err);

        amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) 
                throw error0;

            connection.createChannel(function(error1, channel) {
                if (error1)
                    throw error1;
                
                // El primer argumento es un String vacío para que genere un nombre aleatorio para la cola
                // De esta forma cada cliente tiene su propia "callback queue"
                channel.assertQueue('', {
                    exclusive: true
                }, function(error2, q) {
                    if (error2) {
                        throw error2;
                    }

                    // este ID asegura que el "worker" sabrá a que cliente debe devolver la petición
                    var correlationId = generateUuid();
                    console.log("Enviando petición de compilar...");
        
                    // si se recibe un mensaje con el id generado
                    // esa es la respuesta del servidor, por tanto devolvemos el archivo 
                    // generado por la API REST
                    channel.consume(q.queue, function(msg) {
                        if (msg.properties.correlationId === correlationId){
                            res.download(msg.content.toString());
                        }
                    }, {
                        noAck: true
                    });
        
                    // envío por la cola `queue` del nombre de archivo a compilar
                    channel.sendToQueue(queue,
                        Buffer.from(destino), {
                            correlationId: correlationId,
                            replyTo: q.queue
                        });
                });
            });
        });
    });
});

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

// TODO: al ser la creación del canal de mensajería de naturaleza asíncrona
// creo que cabe la posibilidad de que Express inicie el servicio
// antes de que amqp haya creado su conexión y por tanto que una petición
// pueda fallar. Esto requiere reorganizar el código de worker.js para
// que trabaje con promesas, algo similar a Texcompiler.js
// y así dar la opción de poder esperar a que se ejecute correctamente. 
worker();
app.listen(PORT, () => console.log(`Servidor iniciado en puerto: ${PORT}`))

module.exports = app;