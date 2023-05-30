let _anime = [];

$(function(){
    $ulCapitulos = $("#ulCapitulos");
    $modalCapitulo = $("#modalCapitulo");
    $lblAnime = $("#lblAnime");
    $vCapitulo = $("#vCapitulo");

    $("#ulCapitulos").on('click','.puntero', function(){
        const id = $(this).data('id');
        const idx = _anime.capitulos.findIndex(capitulo => capitulo.numeroCapitulo == id);
        console.log(id,idx)
        $vCapitulo.attr('src', `${_anime.capitulos[idx].pathCapitulo}`)
        $modalCapitulo.modal("show")
    });

    init();
});//FIN ON READY

const init = async ()=>{
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
    _anime.capitulos.forEach(capitulo=>{
        $ulCapitulos.append(`<li class="list-group-item puntero" data-id='${capitulo.numeroCapitulo}'>${capitulo.nombreCapitulo}</li>`)
    })
}