#!/usr/bin/env node
// lado del "servidor" de RabbitMQ
// esta función se ha basado en el tutorial que proponen en la web de RabbitMQ
// titulado: RPC. Link: https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html

// RabbitMQ requiere utilizar el protocolo amqp
const amqp = require('amqplib/callback_api');
const texCompiler = require('./texCompiler');

// Nombre de la cola de RabbitMQ
const queue = 'compiler_queue';

// Recibe un mensaje a través de la cola ´queue´ para realizar el trabajo de compilación del archivo dado
// El mensaje debe contener el nombre del archivo fuente a compilar.
function worker(){
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0)
            throw error0;

        connection.createChannel(function(error1, channel) {
            if (error1) 
                throw error1;
                
            // Esta operación es idempotente, la cola sólo se creará
            // si no existe previamente
            channel.assertQueue(queue, {
                durable: false
            });

            // Para equilibrar la carga en el server si ejecutamos más de un worker
            // hay que activar prefetch
            channel.prefetch(1);

            channel.consume(queue, function reply(msg){
                let fuente = msg.content.toString();
                texCompiler(fuente,false)
                .then(r =>{
                    let pdf = fuente.replace(".tex", ".pdf");

                    // el campo replyTo almacena la cola anónima generada por el cliente
                    channel.sendToQueue(msg.properties.replyTo,
                        Buffer.from(pdf.toString()), {
                            correlationId: msg.properties.correlationId
                        });
            
                    channel.ack(msg);
                })
                .catch(e =>{
                    throw e;
                });
            });
        });
    });
}

module.exports = worker