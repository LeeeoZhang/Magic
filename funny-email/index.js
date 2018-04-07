function $(selector) {
    return document.querySelector(selector)
}
function $$(selector) {
    return document.querySelectorAll(selector)
}

const container = $('#container')

function backgroundColorAnime(){
    anime({
        targets: container,
        backgroundColor:[
            {value:'#3AB54A'},
            {value:'#3aa6e1'},
            {value:'#E26966'},
        ],
        easing: 'linear',
        duration: 5000,
        direction:'alternate',
        loop: true,
    })
}
backgroundColorAnime()
