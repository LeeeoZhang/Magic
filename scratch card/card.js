let WIDTH = document.documentElement.clientWidth,
    HEIGHT = document.documentElement.clientHeight
let canvas = document.getElementById('cav')   
let ctx = canvas.getContext('2d')
let pointer = {
    x:0,
    y:0
}
let isEnd = false

//初始化画布大小
function initCanvas () {
    canvas.width = WIDTH
    canvas.height = HEIGHT
}

//画遮罩
function drawMask(){
    ctx.save()
    ctx.globalAlpha = 0.8
    ctx.fillStyle = '#aaa'
    ctx.fillRect(0,0,WIDTH,HEIGHT)
    ctx.restore()
}

//刮开遮罩
function scratchMask(){
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(pointer.x,pointer.y,100,0,Math.PI*2,true)
    ctx.fill()
    checkHalf()
}

//检查是否刮开超过1/2
function checkHalf() {
    let pxInfo = ctx.getImageData(0,0,WIDTH,HEIGHT)
    let n = 0
    for(let i = 0;i<pxInfo.data.length; i+=4 ) {
        if(pxInfo.data[i] === 0) {
            n++
        }
    }
    if(n >= pxInfo.data.length / 8 ) {
        clear()
        isEnd = true
    }
}
//清除画布
function clear () {
    let p = {r:0}
    anime({
        targets:p,
        r: 1000,
        easing: 'linear',
        update:()=>{
            ctx.beginPath()
            ctx.arc(WIDTH/2,HEIGHT/2,p.r,0,Math.PI*2,true)
            ctx.fill()
        },
        complete:()=>{
            console.log('结束')
            cav.removeEventListener('touchmove',moveEvent)
        }
    })
}

//移动事件
function moveEvent (event) {
    if(isEnd) return
    pointer.x = event.touches[0].clientX
    pointer.y = event.touches[0].clientY
    scratchMask()
}
cav.addEventListener('touchmove', moveEvent)
initCanvas()
drawMask()
