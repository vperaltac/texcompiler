const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

// Compila un archivo .tex de forma asíncrona
// esta función devuelve una Promise que debe ser tratada adecuadamente.
// Entrada de la función:
//  * archivo: nombre del archivo, por ahora se supone que el archivo se encuentra en el directorio /doc
//  * tex_output: true para mostrar la salida que devuelve `pdflatex`. false para no mostrarla.
async function compilar(archivo,usuario,tex_output){
    try{
        const {stdout} = await exec('pdflatex -synctex=1 -interaction=nonstopmode -output-directory data/' 
                                    + usuario + '/out ' + archivo);
    
        if(tex_output)
            console.log(stdout);
    }
    catch(e){
        return e;
    }
}

// Compila un archivo .tex y genera la salida en formato PDF.
// Se utiliza la distribución __TexLive__ para realizar la compilación.
// Se utiliza el comando `pdflatex` para generar el archivo PDF de salida
// directorio de salida por defecto: /doc
// Entrada de la función:
//  * archivo: nombre del archivo, por ahora se supone que el archivo se encuentra en el directorio /doc
//  * tex_output: true para mostrar la salida que devuelve `pdflatex`. false para no mostrarla.
async function texCompiler(datos,tex_output){ 
    // comprobar formato del archivo
    if(!datos.fuente.endsWith('.tex')){
        console.log("Formato incorrecto.");
        return false;
    }

    // comprobar que archivo existe
    if (!fs.existsSync(datos.fuente)){
        console.log("Archivo no encontrado.");
        return false;
    }
 
    // compilar archivo
    try{
        await compilar(datos.fuente,datos.usuario,tex_output);
    }
    catch(error){
        throw error;
    }

    let nombre = datos.nombre.substring(0,datos.nombre.length-4) + ".pdf";
    let nombreF = 'data/' + datos.usuario + "/out/" + nombre;

    // comprobar archivo de salida
    if(fs.existsSync(nombreF)){
        fs.readdir('data/' + datos.usuario + '/out', (err, files) => {
            if (err) {
                console.log(err);
            }
        
            files.forEach(file => {
                const eliminar = path.join('data/' + datos.usuario + '/out/', file);
        
                if (file !== nombre)
                    fs.unlinkSync(eliminar);
            });
        });

        console.log("Archivo creado con éxito.");
        return true;
    }
    else{
        console.log("Error en compilación. El PDF no ha sido generado.");
        return false;
    }
}

module.exports = texCompiler