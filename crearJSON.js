const fs = require('fs'); 
const FOLDER_PRINCIPAL = 'animes';
const DATA_JSON = `${__dirname}/data.json`;
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

try {
    fs.unlinkSync(DATA_JSON);
  
    console.log("Delete File successfully.");
  } catch (error) {
  }

try {
    fs.writeFileSync(DATA_JSON, JSON.stringify(carpetasJSON));
    // file written successfully
} catch (err) {
    console.error(err);
}