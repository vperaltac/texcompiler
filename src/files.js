const fs = require('fs')

async function getTexPath(nombre,usuario){
    let path = 'data/' + usuario + "/src/" + nombre + ".tex";
    const existe_archivo = fs.existsSync(path);

    if(existe_archivo)
        return path;
    else
        return false;
}

module.exports = getTexPath