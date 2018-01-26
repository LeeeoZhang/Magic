const canvas = document.getElementById('meteor')
const ctx = canvas.getContext('2d')
const startNum = 30
const canvasSize = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
}
const speedList = [5, 6, 7, 8, 9, 10]
const lengthList = [10, 15, 20, 25, 30, 35]
const speedRatio = 0.8

let resizeTimer
let requestAnimationId
let starts = []

//计算随机数字
function random (num1, num2) {
    return Math.floor(Math.random() * Math.abs(num2 - num1) + Math.min(num1, num2))
}

//清除画布
function clear () {
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)
}

//计算画布大小
function setCanvasSize () {
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
}

//随机生成开始坐标
function randomInitCoordinate () {
    let x, y
    x = Math.floor(Math.random() * canvasSize.width)
    y = Math.floor(Math.random() * 200)
    return {
        x, y
    }
}

//随机生成结束坐标
function randomEndCoordinate () {
    let x, y
    x = Math.floor(Math.random() * canvasSize.width)
    y = Math.floor(Math.random() * canvasSize.height + 300)
    return {
        x, y
    }
}

//检查流星坐标变化
function checkCoordinate (start) {
    if (start.sx > start.ex && start.sy > start.ey) {
        start.sx = start.ix
        start.sy = start.iy
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
        this.speed = speedList[random(0, 5)]
        //流星长度
        this.length = lengthList[random(0, 5)]
        //保存流星初始坐标
        this.ix = this.sx
        this.iy = this.sy
    }

    updateCoordinate () {
        this.sx += this.speed * speedRatio
        this.sy += this.speed
    }
}

//生成流星
function createStarts () {
    for (let i = 0; i < startNum; i++) {
        starts.push(new Meteor())
    }
}

//渲染流星
function render () {
    clear()
    for (let i = 0; i < starts.length; i++) {
        ctx.strokeStyle = '#fff'
        ctx.beginPath()
        ctx.moveTo(starts[i].sx, starts[i].sy)
        ctx.lineTo(starts[i].sx - starts[i].length * Math.cos(Math.PI / 4), starts[i].sy - starts[i].length * Math.sin(Math.PI / 4))
        ctx.stroke()
        starts[i].updateCoordinate()
        checkCoordinate(starts[i])
    }
    requestAnimationId = requestAnimationFrame(render)
}


//监听窗口resize,重设画布大小(基础节流)
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
        setCanvasSize()
    }, 300)
})



setCanvasSize()
createStarts()
render()