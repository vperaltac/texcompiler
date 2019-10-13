const { exec } = require('child_process')
const fs = require('fs')

function texcompiler(archivo){
    exito = false

    // comprobar formato
    if(archivo.endsWith(".tex")){
        // compilar archivo
        exec('pdflatex -synctex=1 -interaction=nonstopmode -output-directory doc doc/ejemplo.tex', (err, stdout, stderr) => {
            if (err) {
                return "node couldn't execute the command";
            }

            // mostrar salida
            if(stderr)
                console.log(`${stderr}`);
            else
                console.log(`${stdout}`);

            // comprobar que archivo pds existe
            if (fs.existsSync('doc/ejemplo.pdf')) {
                exito = true
            }

            if(exito)
                return "Archivo creado con éxito."
            else
                return "Error: archivo .pdf no encontrado."
        });
    }
    else
        return "Formato incorrecto.";
}

texcompiler("archivo.tex")