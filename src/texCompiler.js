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
        const {err, stdout, stderr} = await exec('pdflatex -synctex=1 -interaction=nonstopmode -output-directory doc ' + archivo);
        if (err) 
            console.error(stderr);
    
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
function texCompiler(archivo,tex_output){
    // se supone que el archivo está en /doc
    archivo = 'doc/' + archivo

    // comprobar formato del archivo
    if(!archivo.endsWith('.tex'))
        return "Formato incorrecto."

    // comprobar que archivo existe
    if (!fs.existsSync(archivo)) 
        return "Archivo no encontrado."

    // compilar archivo
    execSync('pdflatex -synctex=1 -interaction=nonstopmode -output-directory doc ' + archivo, (err, stdout, stderr) => {
        if (err) {
            console.log(`${stderr}`);
            return "Error al ejecutar el comando";
        }

        if(tex_output)
            console.log(`${stdout}`);
    });

    let nombre = archivo.substring(0,archivo.length-4);
    let salida = nombre + '.pdf';

    // comprobar archivo de salida
    if(fs.existsSync(salida))
        return "Archivo creado con éxito."
    else if(fs.existsSync('doc/texput.log'))
        return "Error en compilación. Leer texput.log para más información"
    else
        return "Error en compilación. " + salida + " no encontrado."
}

module.exports = texCompiler