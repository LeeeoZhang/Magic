const canvas = document.getElementById('meteor')
const ctx = canvas.getContext('2d')
const startNum = 30
const canvasSize = {
    width: canvas.width,
    height: canvas.height,
}
const speedList = [10,20,30,40,50,60]
const lengthList = [50,60,70,80,90,100]
const speedRatio = 0.8

let resizeTimer
let 
let starts = []

//计算随机数字
function random (num1, num2) {
    return Math.floor(Math.random() * Math.abs(num2 - num1) + Math.min(num1, num2))
}

//计算画布大小
function setCanvasSize () {
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
}

//随机生成开始坐标
function randomInitCoordinate () {
    let x, y
    x = Math.floor(Math.random() * (canvasSize.width - 600) + 300)
    y = 0
    return {
        x, y
    }
}

//随机生成结束坐标
function randomEndCoordinate () {
    let x, y
    x = Math.floor(Math.random() * (canvasSize.width - 600) + 300)
    y = Math.floor(Math.random() * canvasSize.height / 2 + 300)
    return {
        x, y
    }
}

//流星
class Meteor {
    constructor () {
        //流星坐标起始(startX,startY)
        this.sx = randomInitCoordinate().x
        this.sy = randomInitCoordinate().y
        //流星终止坐标(endX,endY)
        this.ex = randomEndCoordinate().x
        this.ey = randomEndCoordinate().y
        //流星速度
        this.speed = speedList[random(0,5)]
        //流星长度
        this.length = lengthList[random(0,5)]
        //保存流星初始坐标
        this.ix = this.sx
        this.iy = this.sy

    }

    updateCoordinate () {
        this.ix += this.speed * speedRatio
        this.iy += this.speed
    }
}

//生成流星
function createStarts () {
    starts.push(new Meteor())
}

//渲染流星
function render () {
    for(let i =0 ; i<starts.length;i++) {
        ctx.strokeStyle = '#fff'
        ctx.beginPath()
        ctx.moveTo(starts[i].sx,starts[i].sy)
        ctx.lineTo(starts[i].sx - starts[i].length*Math.cos(Math.PI/3),starts[i].sx - starts[i].length*Math.sin(Math.PI/3))
        ctx.stroke()
    }

}


//监听窗口resize,重设画布大小(基础节流)
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
        setCanvasSize()
    }, 300)
})


setCanvasSize()