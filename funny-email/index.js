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
<<<<<<< HEAD

function toSuccess (){
    anime({
        targets:'#messageOutline',
        d:{
            value:[
                'M242.1,265.7l52.4,52.3l51.1-52.3',
                'M308,312.3l-26.2-26 M281.8,313.3l26.2-27'
            ]
        },
        easing:'easeOutSine',
        duration: 500,
    })
}



function popAnime(){
    anime({
        targets:'#container #popGroup line',
        strokeDashoffset: [0,anime.setDashoffset],
        easing:'easeOutSine',
        duration: 300,
    })
}
toSuccess()
//popAnime()
// backgroundColorAnime()
=======
backgroundColorAnime()
>>>>>>> 93d1f150bd91b01d2d864135f802a300a6b1a3dc
