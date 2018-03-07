let scene,          //场景
    camera,         //相机
    fieldOfView,    //视角
    aspectRatio,    //纵横比
    nearPlane,      //近平面
    farPlane,       //远平面
    WIDTH,          //场景宽
    HEIGHT,         //场景高
    renderer,       //渲染器
    container,      //dom容器
    ambientLight    //环境光源
let lion, fan
let pointer = {x: 0, y: 0}
let resizeTimer

//监听窗口resize,重置一些参数
function onWindowResize () {
    WIDTH = window.innerWidth
    HEIGHT = window.innerHeight
    renderer.setSize(WIDTH, HEIGHT)
    camera.aspectRatio = WIDTH / HEIGHT
    camera.updateProjectionMatrix()
}

//创建场景
function createScene () {
    //设置宽高
    WIDTH = window.innerWidth
    HEIGHT = window.innerHeight
    //创建一个新场景
    scene = new THREE.Scene()
    //创建一个透视相机
    aspectRatio = WIDTH / HEIGHT
    fieldOfView = 60
    nearPlane = 1
    farPlane = 1000
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, fieldOfView)
    //设置相机位置
    camera.position.x = 0
    camera.position.y = 200
    camera.position.z = 100
    //创建渲染器
    renderer = new THREE.WebGLRenderer({
        //背景透明
        alpha: true,
        //抗锯齿
        antialias: true,
    })
    renderer.setSize(WIDTH, HEIGHT)
    container = document.body
    container.appendChild(renderer.domElement)
}

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
        onWindowResize()
    }, 300)
})

//风扇
class Fan {
    constructor () {
        this.isBlowing = false
        this.speed = 0
        this.acc = 0
        //创建一系列颜色的纹理
        this.redMat = new THREE.MeshPhongMaterial({
            color: 0xad3525,
            shading: THREE.FlatShading
        })
        this.greyMat = new THREE.MeshPhongMaterial({
            color: 0x653f4c,
            shading: THREE.FlatShading
        })
        this.yellowMat = new THREE.MeshPhongMaterial({
            color: 0xfdd276,
            shading: THREE.FlatShading
        })
        //创建一些的网格
        this.coreGeom = new THREE.BoxGeometry(10, 10, 20)
        this.sphereGeom = new THREE.BoxGeometry(10, 10, 3)
        this.propGeom = new THREE.BoxGeometry(10, 30, 2)
        this.propGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0))
        //初始化风扇
        this.init()
    }

    init () {
        this.core = new THREE.Mesh(this.coreGeom, this.greyMat)

        this.prop1 = new THREE.Mesh(this.propGeom, this.redMat)
        this.prop1.position.z = 15
        this.prop2 = this.prop1.clone()
        this.prop2.rotation.z = Math.PI / 2
        this.prop3 = this.prop1.clone()
        this.prop3.rotation.z = Math.PI
        this.prop4 = this.prop1.clone()
        this.prop4.rotation.z = -Math.PI / 2

        this.sphere = new THREE.Mesh(this.sphereGeom, this.yellowMat)
        this.sphere.position.z = 15

        this.propeller = new THREE.Group()
        this.propeller.add(this.prop1)
        this.propeller.add(this.prop2)
        this.propeller.add(this.prop3)
        this.propeller.add(this.prop4)

        this.threegroup = new THREE.Group()
        this.threegroup.add(this.core)
        this.threegroup.add(this.propeller)
        this.threegroup.add(this.sphere)
    }
}

//狮子
class Lion {

}

function createFan () {
    fan = new Fan()
    console.log(fan.threegroup)
    fan.threegroup.position.z = 350
    scene.add(fan.threegroup)
}

function loop () {
    renderer.render(scene, camera)
    requestAnimationFrame(loop)
}

createScene()
createFan()
loop()



