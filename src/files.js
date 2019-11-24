const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = {
    getTexPath: function(nombre,usuario) {
        let path = 'data/' + usuario + "/src/" + nombre + ".tex";
        const existe_archivo = fs.existsSync(path);
    
        if(existe_archivo)
            return path;
        else
            return false;
    
    },

    listarTodos: function(){
        let usuarios = fs.readdirSync('data');

        let listado = {};
        for(let i=0 ; i< usuarios.length; i++){
            listado[usuarios[i]] = this.listarArchivos(usuarios[i],true,true);
        }

        return listado;
    },

    listarArchivos: function(usuario,src,out) {
        let listado = {};

        if(src){
            let tex = fs.readdirSync('data/' + usuario + "/src/");
            listado['tex'] = tex;
        }

        if(out){
            let pdf = fs.readdirSync('data/' + usuario + "/out/");
            listado['pdf'] = pdf;
        }
    
        return listado;
    },

    eliminarTex: function(usuario,nombre){
        let path = 'data/' + usuario + "/src/" + nombre + ".tex";

        fs.unlinkSync(path);
    },

    eliminarPDF: function(usuario,nombre){
        let path = 'data/' + usuario + "/out/" + nombre + ".pdf";

        fs.unlinkSync(path);
    },
    
    comprobarDirectorio: function(usuario){
        if (!fs.existsSync('data/' + usuario)) {
            fs.mkdirSync('data/' + usuario);
            fs.mkdirSync('data/' + usuario + '/out');
            fs.mkdirSync('data/' + usuario + '/src');
        }
    }
};