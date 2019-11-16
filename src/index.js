const express = require('express');
const fileUpload = require('express-fileupload');
const app  = express();
const texCompiler = require('./texCompiler');
const mkdirp = require('mkdirp');
const uniqueFilename = require('unique-filename');

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

        res.download(destino);
    });
});

app.listen(PORT, () => console.log(`Servidor iniciado en puerto: ${PORT}`));

module.exports = app;