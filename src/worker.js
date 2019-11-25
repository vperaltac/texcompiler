#!/usr/bin/env node
// lado del "servidor" de RabbitMQ
// La conexión con el servidor RabbitMQ se ha basado en Work Queues.
// Para más información puedes visitar los tutoriales oficiales de RabbitMQ
// Link: https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

// RabbitMQ requiere utilizar el protocolo amqp
const amqp = require('amqplib/callback_api');
const texCompiler = require('./texCompiler');

// Nombre de la cola de RabbitMQ
const queue = 'compiler_queue';
const RABBIT_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost';

// Recibe un mensaje a través de la cola ´queue´ para realizar el trabajo de compilación del archivo dado
// El mensaje debe contener el nombre del archivo fuente a compilar.
amqp.connect(RABBIT_URL, function(error0, connection) {
    if (error0)
        throw error0;

    connection.createChannel(function(error1, channel) {
        if (error1) 
            throw error1;
            
        // Esta operación es idempotente, la cola sólo se creará
        // si no existe previamente
        channel.assertQueue(queue, {
            durable: true
        });

        // Para equilibrar la carga en el server si ejecutamos más de un worker
        // hay que activar prefetch
        channel.prefetch(1);

        channel.consume(queue, function(msg){
            console.log("mensaje recibido.");

            let datos = JSON.parse(msg.content.toString());
            texCompiler(datos[0],true)
            .then(r => {
                channel.ack(msg);
            })
            .catch(e =>{
                throw e;
            });  
        },{
            noAck: false
        });
    });
});