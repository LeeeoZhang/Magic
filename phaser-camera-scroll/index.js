const WIDTH = document.documentElement.clientWidth
const HEIGHT = document.documentElement.clientHeight

let game, camera
let isTouch = false
let yDiff = 0, startY,totalDist = 0

function init () {
    game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game', null, true)
    game.state.add('state', state)
    game.state.start('state')
}

let state = {
    preload () {
        game.load.image('bg', './1.jpg')
        camera = game.camera
    },
    create () {
        game.world.setBounds(0, 0, WIDTH, 2500)
        game.add.image(0, 0, 'bg')
        game.input.onDown.add(function(pointer){
            startY = pointer.y
            camera.y = totalDist
        })
        game.input.addMoveCallback(function (pointer, x, y, isTap) {
            yDiff = startY - y
            camera.y = yDiff + totalDist
        })
        game.input.onUp.add(function(){
            totalDist += yDiff
            if(camera.y === 0) {
                totalDist = 0
            } else if (camera.y === 2500 - HEIGHT) {
                totalDist = 2500 - HEIGHT
            }
        })
    },
}

init()