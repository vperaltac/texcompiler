const express = require('express');
const fileUpload = require('express-fileupload');
const app  = express();
const texCompiler = require('./texCompiler');

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
        
    res.send(req.files.documento.name);
});

app.listen(PORT, () => console.log(`Servidor iniciado en puerto: ${PORT}`));

module.exports = app;