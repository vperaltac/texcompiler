#!/usr/bin/env node
const amqp = require('amqplib/callback_api');
const texCompiler = require('./texCompiler'); 

function worker(){
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0)
            throw error0;

        connection.createChannel(function(error1, channel) {
            if (error1) 
                throw error1;
                
            var queue = 'compiler_queue';
            channel.assertQueue(queue, {
                durable: false
            });
            channel.prefetch(1);
            channel.consume(queue, function reply(msg){
                let fuente = msg.content.toString();
                texCompiler(fuente,false)
                .then(r =>{
                    let pdf = fuente.replace(".tex", ".pdf");

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