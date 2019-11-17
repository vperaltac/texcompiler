const express = require('express');
const fileUpload = require('express-fileupload');
const app  = express();
const uniqueFilename = require('unique-filename');
const amqp = require('amqplib/callback_api');

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload());

app.get('/status',(req,res) =>{
    res.json({status: 'OK'})
});

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

        amqp.connect('amqp:://localhost')
        .catch(error0 =>{
            throw error0;
        })
        .then(connection => connection.createChannel())
            .catch(error1 =>{
                throw error1;
            })
            .then(channel => channel.assertQueue('',{exclusive:true}))
                .catch(error2 =>{
                    throw error2;
                })
                .then(q => {
                    let correlationId = generateUuid();
                    console.log("Enviando petición de compilar...");
                    channel.consume(q.queue)
                    .then(msg =>{
                        if (msg.properties.correlationId === correlationId) {
                            res.download(msg.content.toString());

                            console.log(' [.] Got %s', msg.content.toString());
                            setTimeout(function() {
                                connection.close();
                                process.exit(0);
                            }, 500);
                        }
    
                    },{ noAck:true })

                    channel.sendToQueue('compiler_queue',
                    Buffer.from(num.toString()), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
                })
    });
});

app.listen(PORT, () => console.log(`Servidor iniciado en puerto: ${PORT}`));

module.exports = app;