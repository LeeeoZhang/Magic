let canvas = document.querySelector('#draw')
let ctx = canvas.getContext('2d')
let pointer = {x: 0,y: 0}
let resizeTimer
let colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C']
let ballNumbers = 30

let clear = anime({
    duration: Infinity,
    update:function(){
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }
})

function setCanvasSize () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function setBallEndPos(p) {
    let angle = anime.random(0,360)*Math.PI/180
    let value = anime.random(50,180)
    let radius = [-1,1][anime.random(0,1)] * value
    return {
        x: p.x + radius*Math.cos(angle),
        y: p.y + radius*Math.sin(angle)
    }
}

function createBall (x,y) {
    let p = {}
    p.x = x
    p.y = y
    p.color = colors[anime.random(0,colors.length - 1)]
    p.radius = anime.random(16,32)
    p.endPos = setBallEndPos(p)
    p.draw = function(){
        ctx.beginPath()
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2,true)
        ctx.fillStyle = p.color
        ctx.fill()
    }
    return p
}

function createCircle (x,y) {
    let p = {}
    p.x = x
    p.y = y
    p.radius = 0.1
    p.lineWidth = 6
    p.color = '#fff'
    p.alpha = 0.5
    p.draw = () => {
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x,p.y,p.radius,0,2*Math.PI,true)
        ctx.lineWidth = p.lineWidth
        ctx.strokeStyle = p.color
        ctx.stroke()
        ctx.globalAlpha = 1
    }
    return p
}


function animation(x,y) {
    let circle = createCircle(x,y)
    let balls = []
    for(let i = 0; i< ballNumbers; i++) {
        balls.push(createBall(x,y))
    }
    anime.timeline()
    .add({
        targets: balls,
        x: p => p.endPos.x,
        y: p => p.endPos.y,
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: render,
    })
    .add({
        targets: circle,
        radius: anime.random(80,150),
        lineWidth: 0,
        round:1,
        alpha: {
            value: 0,
            easing: 'linear',
            duration: anime.random(600,800)
        },
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: render,
        offset: 0
    })    
}

function render(animeManager) {
    Array.prototype.forEach.call(animeManager.animatables,(item,index)=>{
        item.target.draw()
    })
}


canvas.addEventListener('click',(event)=>{
    pointer.x = event.clientX
    pointer.y = event.clientY
    clear.play()
    animation(pointer.x,pointer.y)
    // let circle = creatCircle(pointer.x,pointer.y)
    // anime({
    //     targets: circle,
    //     radius: anime.random(80,150),
    //     lineWidth: 0,
    //     round:1,
    //     duration: 300,
    //     easing: 'easeOutExpo',
    //     update: function(){
    //         circle.draw()
    //     }
    // })
})

window.addEventListener('resize',(event)=>{
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(()=>{
        setCanvasSize()
    },300)
})


setCanvasSize()
