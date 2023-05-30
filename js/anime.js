let _anime = [];
let _capitulo;
let _idxCapitulo = 0;
let _storeArray = [];
let _tiempoCapitulo = 0;
const _ULTIMO = 'ULTIMO_';
const _TIEMPO = 'TIEMPO_';
const _STORE = 'STORE_';

$(function(){
    $ulCapitulos = $("#ulCapitulos");
    $modalCapitulo = $("#modalCapitulo");
    $lblAnime = $("#lblAnime");
    $vCapitulo = $("#vCapitulo");
    $txtNombreCapitulo = $("#txtNombreCapitulo");
    _capitulo = document.getElementById('vCapitulo');
    $btnAtras = $("#btnAtras");
    $btnAdelante = $("#btnAdelante");
    $h2Animes = $("#h2Animes");

    $("#ulCapitulos").on('click','.puntero', function(){
        const id = $(this).data('id');
        _idxCapitulo = _anime.capitulos.findIndex(capitulo => capitulo.numeroCapitulo == id);
        seleccionarCapitulo();
        $modalCapitulo.modal("show")
    });

    $modalCapitulo.on('hidden.bs.modal', function(){
        _capitulo.pause();
        pintarCapitulos();
    })

    $btnAtras.on('click', function(){
        if(_idxCapitulo>0){
            _idxCapitulo--;
            seleccionarCapitulo();
        }
    })

    $btnAdelante.on('click', function(){
        if(_idxCapitulo < _anime.capitulos.length-1){
            _idxCapitulo++;
            seleccionarCapitulo();
        }
    })

    _capitulo.addEventListener('timeupdate', function(e){
        _tiempoCapitulo = _capitulo.currentTime;
        guardarTiempo();
    });

    $h2Animes.on('click', function(){
        window.location = 'index.html';
    });

    init();
});//FIN ON READY

const seleccionarCapitulo = ()=>{
    $vCapitulo.attr('src', `${_anime.capitulos[_idxCapitulo].pathCapitulo}`);
    $txtNombreCapitulo.text(`${_anime.capitulos[_idxCapitulo].nombreCapitulo} (${_anime.nombreAnime})`);
    guardarUltimo();
    colocarTiempoCapitulo();
}

const guardarUltimo = ()=>{
    const key = `${_ULTIMO}${_anime.idAnime}`;
    
    let idxUltimo = _storeArray.findIndex(x=>x.key == key);
    console.log(idxUltimo)
    if(idxUltimo>-1){
        _storeArray[idxUltimo].value = _anime.capitulos[_idxCapitulo].numeroCapitulo;
    }else{
        _storeArray.push({key, value:_anime.capitulos[_idxCapitulo].numeroCapitulo});
    }

    localStorage.setItem(_STORE, JSON.stringify(_storeArray));
    pintarUltimo();
}

const guardarTiempo = ()=>{
    const key = `${_TIEMPO}${_anime.idAnime}${_anime.capitulos[_idxCapitulo].numeroCapitulo}`;
    let idxTiempo = _storeArray.findIndex(x=>x.key == key);
    if(idxTiempo>-1){
        _storeArray[idxTiempo].value = {actual:_tiempoCapitulo, total:_capitulo.duration};
    }else{
        _storeArray.push({key, value:{actual:_tiempoCapitulo, total:_capitulo.duration}});
    }

    localStorage.setItem(_STORE, JSON.stringify(_storeArray));
}

const init = async ()=>{
    _storeArray = JSON.parse(localStorage.getItem(_STORE)) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    await getData();
    _anime = _data.filter(anime => anime.idAnime == id)[0];
    $lblAnime.text(_anime.nombreAnime)
    pintarCapitulos();
}

const getData = async ()=>{
    try {
        const request = await fetch('./data/data.json');
        _data = await request.json();
    } catch (error) {
        console.log(error)
    }
}

const pintarCapitulos = ()=>{
    $ulCapitulos.empty();
    _anime.capitulos.forEach(capitulo=>{
        const key = `${_TIEMPO}${_anime.idAnime}${capitulo.numeroCapitulo}`;
        const {actual = 0, total=1} = _storeArray.find(x=>x.key == key).value;
        console.log(actual, total, (actual/total)*100)

        $ulCapitulos.append(`<li class="list-group-item puntero" data-id='${capitulo.numeroCapitulo}'>${capitulo.nombreCapitulo}<div class="progress">
        <div class="progress-bar" role="progressbar" aria-label="Basic example" style="width: ${(actual/total)*100}%"></div>
      </div></li>`)
    });

    pintarUltimo();
}

const pintarUltimo = ()=>{
    const key = `${_ULTIMO}${_anime.idAnime}`;
    console.log(_storeArray)
    const numero = _storeArray.find(x=>x.key == key).value;
    $('.ultimo').removeClass('ultimo');
    $(`li[data-id='${numero}']`).addClass('ultimo');
}

const colocarTiempoCapitulo = ()=>{
    const key = `${_TIEMPO}${_anime.idAnime}${_anime.capitulos[_idxCapitulo].numeroCapitulo}`;
    const tiempo = _storeArray.find(x=>x.key == key)?.value.actual || 0;
    _capitulo.currentTime = tiempo-3;
}