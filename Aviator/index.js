//调色板
const Colors = {
    red: 0xf25346,
    white: 0xd8d0d1,
    brown: 0x59332e,
    pink: 0xF5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0
}

window.addEventListener('load', init, false)

function init () {
    //创建场景，相机和渲染器
    createScene()
    //添加光源
    createLights()
    //添加对象
    createPlane()
    createSea()
    createSky()
    //循环调用函数,在每帧更新对象的位置和渲染场景
    loop()

    //监听鼠标事件
    document.addEventListener('mousemove', handleMouseMove, false)
}

//场景的相关参数
let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container, ambientLight

function handleWindowResize () {
    HEIGHT = window.innerHeight
    WIDTH = window.innerWidth
    renderer.setSize(WIDTH, HEIGHT)
    camera.aspect = WIDTH / HEIGHT
    camera.updateProjectionMatrix()
}

function createScene () {
    //获取屏幕宽高,设置相机纵横比和渲染器大小
    HEIGHT = window.innerHeight
    WIDTH = window.innerWidth

    //创建一个场景
    scene = new THREE.Scene()

    //在场景中添加雾的效果,试用和背景一样的颜色
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950)

    //创建一个透视相机
    aspectRatio = WIDTH / HEIGHT 	//纵横比
    fieldOfView = 60				//视角
    nearPlane = 1					//近平面
    farPlane = 10000				//远平面
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)

    //设置相机位置
    camera.position.x = 0
    camera.position.y = 200
    camera.position.z = 100

    //创建渲染器
    renderer = new THREE.WebGLRenderer({
        //背景色透明,显示css中的颜色
        alpha: true,
        //是否开启抗锯齿,对性能有一定影响
        antialias: true
    })

    //设置渲染器的尺寸,这里是填满整个屏幕
    renderer.setSize(WIDTH, HEIGHT)

    //打开渲染器的阴影地图
    renderer.shadowMap.enabled = true

    //把渲染器dom插入到页面的指定容器中
    container = document.querySelector('#world')
    container.appendChild(renderer.domElement)

    //监听屏幕的resize,更新相机的纵横比
    window.addEventListener('resize', handleWindowResize, false)
}

//光源相关参数
let hemisphereLight, shadowLight

function createLights () {
    //选用半球光,半球光就是渐变的光
    //参数 天空颜色,地面颜色,光的强度
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9)

    //环境光源
    ambientLight = new THREE.AmbientLight(0xdc8874, .5)

    //还用到了方向光
    //方向光是类似太阳,从特定一个方向照射的平行光
    //参数 关系颜色,光的强度
    shadowLight = new THREE.DirectionalLight(0xffffff, .9)

    //设置方向光的方向
    //不同方向作用在物体的面也不同,表现出的颜色也不同
    shadowLight.position.set(150, 350, 350)

    //开启光源投影
    shadowLight.castShadow = true

    // 定义可见域的投射阴影
    shadowLight.shadow.camera.left = -400
    shadowLight.shadow.camera.right = 400
    shadowLight.shadow.camera.top = 400
    shadowLight.shadow.camera.bottom = -400
    shadowLight.shadow.camera.near = 1
    shadowLight.shadow.camera.far = 1000

    //定义阴影分辨率,质量越好,需求性能越高
    shadowLight.shadow.mapSize.width = 2048
    shadowLight.shadow.mapSize.height = 2048

    //把光源添加到场景中才能生效
    scene.add(hemisphereLight)
    scene.add(shadowLight)
    scene.add(ambientLight)
}

//定义大海对象
function Sea () {
    //创建一个圆柱几何体
    //参数 顶面半径,地面半径,高度,半径分段,高度分段
    let geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10)

    //在x轴旋转几何体
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))

    //合并顶点,保持海浪连续
    geom.mergeVertices()

    //获得顶点
    let l = geom.vertices.length

    //创建一个新的数组存储与每个顶点关联的值
    this.waves = []
    for (let i = 0; i < l; i++) {
        let v = geom.vertices[i]
        this.waves.push({
            y: v.y,
            x: v.x,
            z: v.z,
            //随机角度
            ang: Math.random() * Math.PI * 2,
            //随机距离
            amp: 5 + Math.random() * 15,
            //在0.016至0.048度/帧之间随机速度
            speed: 0.016 + Math.random() * 0.032
        })
    }
    //创建材质
    let mat = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        opacity: .6,
        shading: THREE.FlatShading,
    })

    //使用网格用来组合几何和一些材质
    this.mesh = new THREE.Mesh(geom, mat)

    //允许大海对象接收阴影
    this.mesh.receiveShadow = true
}

// 创建一个在每帧可以调用的函数，用于更新顶点的位置来模拟海浪。
Sea.prototype.moveWaves = function () {

    // 获取顶点
    let verts = this.mesh.geometry.vertices
    let l = verts.length

    for (let i = 0; i < l; i++) {
        let v = verts[i]

        // 获取关联的值
        let vprops = this.waves[i]

        // 更新顶点的位置
        v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp
        v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp

        // 下一帧自增一个角度
        vprops.ang += vprops.speed
    }

    // 告诉渲染器代表大海的几何体发生改变
    // 事实上，为了维持最好的性能
    // Three.js 会缓存几何体和忽略一些修改
    // 除非加上这句
    this.mesh.geometry.verticesNeedUpdate = true
    sea.mesh.rotation.z += .005
}

//创建对象，
//我们需要：
//创建几何体
//创建材质
//将它们传入网格
//将网格添加至场景
//实例化大海
let sea

function createSea () {
    sea = new Sea()
    sea.mesh.position.y = -500
    //添加大海到场景
    scene.add(sea.mesh)
}

//定义一个云对象
function Cloud () {
    //创建一个容器来放置不同的云
    this.mesh = new THREE.Object3D()

    //创建一个正方体
    //这个正方体会被重复复制用来创建云
    let geom = new THREE.BoxGeometry(20, 20, 20)

    //创建材质
    let mat = new THREE.MeshPhongMaterial({
        color: Colors.white,
    })

    //随机多次复制几何体
    let nBlocs = 3 + Math.floor(Math.random() * 3)
    for (let i = 1; i < nBlocs; i++) {

        let m = new THREE.Mesh(geom, mat)

        //随机设置正方体的位置和旋转角度
        m.position.x = i * 15
        m.position.y = Math.random() * 10
        m.position.z = Math.random() * 10
        m.rotation.z = Math.random() * Math.PI * 2
        m.rotation.y = Math.random() * Math.PI * 2

        //随机设置正方体大小
        let s = 0.1 + Math.random() * 0.9
        m.scale.set(s, s, s)

        //允许每个正方体生成投影和接收阴影
        m.castShadow = true
        m.receiveShadow = true

        //将正方体添加到开始的容器中
        this.mesh.add(m)
    }
}

//定义天空对象
function Sky () {
    //创建空容器
    this.mesh = new THREE.Object3D()

    //选取若干朵云散步在空中
    this.nClouds = 20

    //根据一定的角度放置云,散布在空中
    let setpAngle = Math.PI * 2 / this.nClouds

    //创建云对象
    for (let i = 0; i < this.nClouds; i++) {
        let c = new Cloud()

        //设置每朵云的旋转角度和位置
        let a = setpAngle * i
        let h = 750 + Math.random() * 200		//轴的中心和云本身之间的距离

        c.mesh.position.y = Math.sin(a) * h
        c.mesh.position.x = Math.cos(a) * h

        //根据云的位置旋转
        c.mesh.rotation.z = a + Math.PI / 2

        //我们把云放置在场景中的随机深度位置
        c.mesh.position.z = -400 - Math.random() * 400

        //每朵云设置一个随机大小
        let s = 1 + Math.random() * 2
        c.mesh.scale.set(s, s, s)

        //把云的网格添加到场景中
        this.mesh.add(c.mesh)
    }
}

//实例化天空
let sky

function createSky () {
    sky = new Sky()
    sky.mesh.position.y = -600
    scene.add(sky.mesh)
}

//定义飞机
function AirPlane () {
    this.mesh = new THREE.Object3D()

    //创建机舱
    let geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1)
    let matCockpit = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading
    })
    geomCockpit.vertices[4].y -= 10
    geomCockpit.vertices[4].z += 20
    geomCockpit.vertices[5].y -= 10
    geomCockpit.vertices[5].z -= 20
    geomCockpit.vertices[6].y += 30
    geomCockpit.vertices[6].z += 20
    geomCockpit.vertices[7].y += 30
    geomCockpit.vertices[7].z -= 20

    let cockpit = new THREE.Mesh(geomCockpit, matCockpit)
    cockpit.castShadow = true
    cockpit.receiveShadow = true
    this.mesh.add(cockpit)

    //创建引擎
    let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1)
    let matEngine = new THREE.MeshPhongMaterial({
        color: Colors.white,
        shading: THREE.FlatShading
    })
    let engine = new THREE.Mesh(geomEngine, matEngine)
    engine.position.x = 40
    engine.castShadow = true
    engine.receiveShadow = true
    this.mesh.add(engine)

    // 创建机尾
    let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1)
    let matTailPlane = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading
    })
    let tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane)
    tailPlane.position.set(-35, 25, 0)
    tailPlane.castShadow = true
    tailPlane.receiveShadow = true
    this.mesh.add(tailPlane)

    //创建机翼
    let geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1)
    let matSideWing = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading
    })
    let sideWing = new THREE.Mesh(geomSideWing, matSideWing)
    sideWing.castShadow = true
    sideWing.receiveShadow = true
    this.mesh.add(sideWing)

    // 创建螺旋桨
    let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1)
    let matPropeller = new THREE.MeshPhongMaterial({
        color: Colors.brown,
        shading: THREE.FlatShading
    })
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller)
    this.propeller.castShadow = true
    this.propeller.receiveShadow = true

    //创建螺旋桨的桨叶
    let geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1)
    let matBlade = new THREE.MeshPhongMaterial({
        color: Colors.brownDark,
        shading: THREE.FlatShading
    })
    let blade = new THREE.Mesh(geomBlade, matBlade)
    blade.position.set(8, 0, 0)
    blade.castShadow = true
    blade.receiveShadow = true
    this.propeller.add(blade)
    this.propeller.position.set(50, 0, 0)
    this.mesh.add(this.propeller)

    this.pilot = new Pilot()
    this.pilot.mesh.position.set(-10, 27, 0)
    this.mesh.add(this.pilot.mesh)
}

//实例化飞机
let airplane

function createPlane () {
    airplane = new AirPlane()
    airplane.mesh.scale.set(0.25, 0.25, 0.25)
    airplane.mesh.position.y = 100
    scene.add(airplane.mesh)
}

//场景运动
function loop () {
    //使螺旋桨旋转并转动大海和云
    sea.mesh.rotation.z += 0.005
    sky.mesh.rotation.z += 0.01

    //每帧更新飞机位置
    updatePlane()
    //更新浪
    sea.moveWaves()

    //渲染场景
    renderer.render(scene, camera)
    requestAnimationFrame(loop)
}

let mousePos = {x: 0, y: 0}

function handleMouseMove (event) {
    //把鼠标位置的值进行归一化,在-1,1之间变化
    let tx = -1 + (event.clientX / WIDTH) * 2

    //2d的y轴与3d的y轴是反的,换算
    let ty = 1 - (event.clientY / HEIGHT) * 2
    mousePos = {x: tx, y: ty}
}

function updatePlane () {
    // 让我们在x轴上-100至100之间和y轴25至175之间移动飞机
    // 根据鼠标的位置在-1与1之间的范围，我们使用的normalize函数
    let targetX = normalize(mousePos.x, -1, 1, -100, 100)
    let targetY = normalize(mousePos.y, -1, 1, 125, 275)

    // 更新飞机的位置
    // 在每帧通过添加剩余距离的一小部分的值移动飞机(Y距离)
    airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * 0.1
    // 剩余的距离按比例转动飞机
    airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * 0.0128
    airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * 0.0064

    airplane.mesh.position.x = targetX

    airplane.pilot.updateHairs()
    airplane.propeller.rotation.x += 0.3
}

function normalize (v, vmin, vmax, tmin, tmax) {

    let nv = Math.max(Math.min(v, vmax), vmin)
    let dv = vmax - vmin
    let pc = (nv - vmin) / dv
    let dt = tmax - tmin
    let tv = tmin + (pc * dt)
    return tv
}

//飞行员
function Pilot () {
    this.mesh = new THREE.Object3D()
    this.mesh.name = "pilot"

    //头发动画属性
    this.angleHairs = 0

    //飞行员的身体
    let bodyGeom = new THREE.BoxGeometry(15, 15, 15)
    let bodyMat = new THREE.MeshPhongMaterial({
        color: Colors.brown,
        shading: THREE.FlatShading,
    })
    let body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.set(2, -12, 0)
    this.mesh.add(body)

    //飞行员的脸部
    let faceGeom = new THREE.BoxGeometry(10, 10, 10)
    let faceMat = new THREE.MeshPhongMaterial({color: Colors.pink})
    let face = new THREE.Mesh(faceGeom, faceMat)
    this.mesh.add(face)

    //飞行员的头发
    let hairGeom = new THREE.BoxGeometry(4, 4, 4)
    let hairMat = new THREE.MeshPhongMaterial({color: Colors.brown})
    let hair = new THREE.Mesh(hairGeom, hairMat)

    //调整头发形状至底部边界,更易扩展
    hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0))

    //创建一个头发容器
    let hairs = new THREE.Object3D()

    //头发顶部容器,制作动效
    this.hairsTop = new THREE.Object3D()

    // 创建头顶的头发并放置他们在一个3*4的网格中
    for (let i = 0; i < 12; i++) {
        let h = hair.clone()
        let col = i % 3
        let row = Math.floor(i / 3)
        let startPosZ = -4
        let startPosX = -4
        h.position.set(startPosX + row * 4, 0, startPosZ + col * 4)
        this.hairsTop.add(h)
    }
    hairs.add(this.hairsTop)

    //创建脸庞头发
    let hairSideGeom = new THREE.BoxGeometry(12, 4, 2)
    hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0))
    let hairSideR = new THREE.Mesh(hairSideGeom, hairMat)
    let hairSideL = hairSideR.clone()
    hairSideR.position.set(8, -2, 6)
    hairSideL.position.set(8, -2, -6)
    hairs.add(hairSideR)
    hairs.add(hairSideL)

    // 创建后脑勺的头发
    let hairBackGeom = new THREE.BoxGeometry(2, 8, 10)
    let hairBack = new THREE.Mesh(hairBackGeom, hairMat)
    hairBack.position.set(-1, -4, 0)
    hairs.add(hairBack)
    hairs.position.set(-5, 5, 0)

    this.mesh.add(hairs)

    //创建眼镜
    let glassGeom = new THREE.BoxGeometry(5, 5, 5)
    let glassMat = new THREE.MeshLambertMaterial({color: Colors.brown})
    let glassR = new THREE.Mesh(glassGeom, glassMat)
    glassR.position.set(6, 0, 3)
    let glassL = glassR.clone()
    glassL.position.z = -glassR.position.z

    //创建挡风玻璃
    let glassAGeom = new THREE.BoxGeometry(11, 1, 11)
    let glassA = new THREE.Mesh(glassAGeom, glassMat)
    this.mesh.add(glassR)
    this.mesh.add(glassL)
    this.mesh.add(glassA)

    //创建耳朵
    let earGeom = new THREE.BoxGeometry(2, 3, 2)
    let earL = new THREE.Mesh(earGeom, faceMat)
    earL.position.set(0, 0, -6)
    let earR = earL.clone()
    earR.position.set(0, 0, 6)
    this.mesh.add(earL)
    this.mesh.add(earR)
}

// 移动头发
Pilot.prototype.updateHairs = function () {

    // 获得头发
    let hairs = this.hairsTop.children

    // 根据 angleHairs 的角度更新头发
    let l = hairs.length
    for (let i = 0; i < l; i++) {
        let h = hairs[i]
        // 每根头发将周期性的基础上原始大小的75%至100%之间作调整。
        h.scale.y = .75 + Math.cos(this.angleHairs + i / 3) * .25
    }
    // 在下一帧增加角度
    this.angleHairs += 0.16
}