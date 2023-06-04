const fs = require('fs'); 
const FOLDER_PRINCIPAL = 'animes';
const carpetas = fs.readdirSync(__dirname, {withFileTypes:true}).filter(x=>x.isDirectory()).map(carpeta => (carpeta.name));

const carpetasJSON = carpetas.map(carpeta=>({
    nombreAnime:carpeta,
    idAnime:carpeta.replace(/ /g, ""),
    capitulos:[]
}))

carpetasJSON.forEach((anime,idx) => {
    const capitulos = fs.readdirSync(`${__dirname}/${anime.nombreAnime}`, {withFileTypes:true}).filter(x=>!x.isDirectory()).map((archivo, idxCapitulo) => ({
        numeroCapitulo:idxCapitulo+1,
        nombreCapitulo:archivo.name,
        pathCapitulo:`${FOLDER_PRINCIPAL}/${anime.nombreAnime}/${archivo.name}`
    }));
    anime.capitulos = capitulos || [];
});
console.log(JSON.stringify(carpetasJSON));