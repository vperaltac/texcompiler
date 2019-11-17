#!/usr/bin/env node
const amqp = require('amqplib/callback_api');

function controller(){
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) 
            throw error0;

        connection.createChannel(function(error1, channel) {
            if (error1) 
                throw error1;

            channel.assertQueue('',{
                exclusive: true
            }, function(error2, q) {
                if (error2)
                    throw error2;

                let correlationId = generateUuid();
    
                console.log("Enviando petición de compilar...");
    
                channel.consume(q.queue, function(msg) {
                    if (msg.properties.correlationId === correlationId) {
                        console.log(' [.] Got %s', msg.content.toString());
                        setTimeout(function() {
                            connection.close();
                            process.exit(0);
                        }, 500);
                    }
                }, {
                    noAck: true
                });
    
                channel.sendToQueue('compiler_queue',
                    Buffer.from(num.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
            });
        });
    });    
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = controller