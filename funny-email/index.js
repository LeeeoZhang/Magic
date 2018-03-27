function $(selector) {
    return document.querySelector(selector)
}
function $$(selector) {
    return document.querySelectorAll(selector)
}

let container = $('#container')

function backgroundColorAnime(){
    anime({
        targets: container,
        backgroundColor:[
            {value:'#3AB54A'},
            {value:'#3aa6e1'},
            {value:'#E26966'},
        ],
        easing: 'linear',
        duration:5000,
        direction:'alternate',
        loop: true,
    })
}

function popAnime(){
    anime({
        targets:'#container #popGroup line',
        strokeDashoffset: [0, anime.setDashoffset],
        easing:'easeInOutSine',
        duration: 1500,
        direction:'alternate'
    })
}
popAnime()
// backgroundColorAnime()
