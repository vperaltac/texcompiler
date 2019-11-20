const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Compila un archivo .tex de forma asíncrona
// esta función devuelve una Promise que debe ser tratada adecuadamente.
// Entrada de la función:
//  * archivo: nombre del archivo, por ahora se supone que el archivo se encuentra en el directorio /doc
//  * tex_output: true para mostrar la salida que devuelve `pdflatex`. false para no mostrarla.
async function compilar(archivo,tex_output){
    try{
        const {stdout} = await exec('pdflatex -synctex=1 -interaction=nonstopmode -output-directory doc ' + archivo);
    
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
async function texCompiler(archivo,tex_output){
    // comprobar formato del archivo
    if(!archivo.endsWith('.tex')){
        console.log("Formato incorrecto.");
        return false;
    }

    // comprobar que archivo existe
    if (!fs.existsSync(archivo)){
        console.log("Archivo no encontrado.");
        return false;
    }
 
    // compilar archivo
    try{
        await compilar(archivo,tex_output);
    }
    catch(error){
        throw error;
    }

    let nombre = archivo.substring(0,archivo.length-4);
    let salida = nombre + '.pdf';

    // comprobar archivo de salida
    if(fs.existsSync(salida)){
        console.log("Archivo creado con éxito.");
        return true;
    }
    else{
        console.log("Error en compilación. El PDF no ha sido generado.");
        return false;
    }
}

module.exports = texCompiler