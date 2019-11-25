#!/usr/bin/env node
// La conexión con el servidor RabbitMQ se ha basado en Work Queues.
// Para más información puedes visitar los tutoriales oficiales de RabbitMQ
// Link: https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html

const amqp  = require('amqplib/callback_api');
const queue = 'compiler_queue'; // Nombre de la cola de RabbitMQ
const RABBIT_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost:5672';

function task(datos){
    amqp.connect(RABBIT_URL, function(error0, connection) {
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
        });
    });
}

module.exports = task;