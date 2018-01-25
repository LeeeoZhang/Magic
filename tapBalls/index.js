let canvas = document.querySelector('#draw')
let ctx = canvas.getContext('2d')
//鼠标坐标
let pointer = {x: 0,y: 0}
let resizeTimer
//小球颜色
let colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C']
//小球数量
let ballNumbers = 30

let clear = anime({
    duration: Infinity,
    update:function(){
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }
})

//设置画布大小
function setCanvasSize () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

//生成小球的终点位置
function setBallEndPos(p) {
    let angle = anime.random(0,360)*Math.PI/180
    let value = anime.random(50,180)
    let radius = [-1,1][anime.random(0,1)] * value
    return {
        x: p.x + radius*Math.cos(angle),
        y: p.y + radius*Math.sin(angle)
    }
}

//创建小球对象
function createBall (x,y) {
    let p = {}
    //小球的起始坐标
    p.x = x
    p.y = y
    //小球的颜色
    p.color = colors[anime.random(0,colors.length - 1)]
    //小球的半径
    p.radius = anime.random(16,32)
    //小球的终点坐标
    p.endPos = setBallEndPos(p)
    //画小球
    p.draw = function(){
        ctx.beginPath()
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2,true)
        ctx.fillStyle = p.color
        ctx.fill()
    }
    return p
}

//创建大球对象
function createCircle (x,y) {
    let p = {}
    p.x = x
    p.y = y
    p.radius = 0.1
    p.lineWidth = 6
    p.color = '#fff'
    p.alpha = 1
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
    //循环生成一系列的小球
    for(let i = 0; i< ballNumbers; i++) {
        balls.push(createBall(x,y))
    }
    //启动一个动画队列
    anime.timeline()
    .add({
        //动画的目标,可以是一个dom,一个选择器,一个对象,或者是一个数组
        targets: balls,
        //因为这里是一系列的小球对象,所以指定需要改变的小球对象的属性,指定其终止值即可
        //这里接收了一个函数,函数的参数就是动画目标,如果传入了一个数组,则参数为数组中的单个成员
        x: p => p.endPos.x,
        y: p => p.endPos.y,
        //同样是指定需要改变的属性
        radius: 0.1,
        //动画时间
        duration: anime.random(1200, 1800),
        //缓动函数
        easing: 'easeOutExpo',
        //每次动画执行的回调函数
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

//update的回调函数,会接收到一个参数,里面包含了动画目标等多种信息
function render(animeManager) {
    //每次动画都重新绘画一次,因为每次绘画参数都被改变
    Array.prototype.forEach.call(animeManager.animatables,(item,index)=>{
        item.target.draw()
    })
}

//监听点击事件,记录鼠标坐标
canvas.addEventListener('click',(event)=>{
    pointer.x = event.clientX
    pointer.y = event.clientY
    //清空画布
    clear.play()
    //在鼠标位置创建大球和小球
    animation(pointer.x,pointer.y)
})

//监听窗口变化
window.addEventListener('resize',(event)=>{
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(()=>{
        setCanvasSize()
    },300)
})

setCanvasSize()
