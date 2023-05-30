let _data = [];

$(function(){
    $ulSeries = $("#ulSeries");

    init();
});//FIN ON READY

const init = async ()=>{
    await getData();
    pintarAnimes()
}

const getData = async ()=>{
    try {
        const request = await fetch('./data/data.json');
        _data = await request.json();
        console.log(_data)
    } catch (error) {
        console.log(error)
    }
}

const pintarAnimes = ()=>{
    _data.forEach(serie=>{
        $ulSeries.append(`<a href='anime.html?id=${serie.idAnime}' class="list-group-item list-group-item-action">${serie.nombreAnime}</a>`)
    })
}