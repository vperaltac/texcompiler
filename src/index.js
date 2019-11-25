const express    = require('express');
const fileUpload = require('express-fileupload');
const files      = require('./files');
const app        = express();
const task       = require('./task');


const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload());

/**
 * @api {get} /status Devuelve OK si el servicio está disponible
 * @apiName getStatus
 * @apiGroup test
 *
 * @apiSuccess {json} Status: OK
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
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {json} todos los archivos de todos los usuarios en el servidor.
 */
app.get('/listar', (req,res) => {
    let todos = files.listarTodos();

    res.send(todos);
});

/**
 * @api {get} /pdf/:nombre/:usuario
 * @apiName getPDF
 * @apiGroup Main
 * 
 * @apiParam {String} nombre Nombre del archivo
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {File} documento PDF solicitado
 */
app.get('/pdf/:nombre/:usuario', (req,res) => {
    let path = 'data/' + req.params.usuario + '/out/' + req.params.nombre + '.pdf';
    res.download(path);
});

/**
 * @api {delete} /tex/:nombre/:usuario eliminar documento latex
 * @apiName eliminarTex
 * @apiGroup eliminar Archivos
 * 
 * @apiParam {String} nombre Nombre del archivo
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {String} mensaje confirmando que el archivo ha sido eliminado.
 */
app.delete('/tex/:nombre/:usuario', (req,res) => {
    files.eliminarTex(req.params.usuario,req.params.nombre);

    res.send("Archivo eliminado.");
});

/**
 * @api {delete} /pdf/:nombre/:usuario eliminar documento pdf
 * @apiName eliminarPDF
 * @apiGroup eliminar Archivos
 * 
 * @apiParam {String} nombre Nombre del archivo
 * @apiParam {String} usuario Nombre de usuario
 *
 * @apiSuccess {String} mensaje confirmando que el archivo ha sido eliminado.
 */
app.delete('/pdf/:nombre/:usuario', (req,res) => {
    files.eliminarPDF(req.params.usuario,req.params.nombre);

    res.status(200).send("Archivo eliminado.");
});

/**
 * @api {post} /tex/:usuario subir documento latex
 * @apiName postTex
 * @apiGroup Main
 *
 * @apiSuccess {String} indica que el archivo se subió correctamente y la compilación comenzará en breve
 * 
 * @apiError FileNotFound No se encontró el archivo fuente.
 * @apiError WrongName Nombre incorrecto.
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

    files.comprobarDirectorio(req.params.usuario);

    documento.mv(destino, function(err){
        if(err)
            return res.status(500).send(err);

        task(datos);
        res.status(200).send("Archivo subido. El PDF se generará en breve.");
    });
});

app.listen(PORT, () => console.log(`Servidor iniciado en puerto: ${PORT}`));
module.exports = app;