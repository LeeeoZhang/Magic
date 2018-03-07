let canvas = document.getElementById('canvas')
let camera,
    scene,
    renderer,
    cube,
    geometry,
    material,
    animate
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

//初始化场景
scene = new THREE.Scene()

//创建相机
camera = new THREE.PerspectiveCamera(75,WIDTH/HEIGHT,0.1,1000)
camera.position.z = 5

//初始渲染器
renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

//创建正方体
geometry = new THREE.BoxGeometry(1,1,1)
material = new THREE.MeshBasicMaterial({color: 'orange'})
cube = new THREE.Mesh(geometry,material)
scene.add(cube)

animate = function(){
    requestAnimationFrame(animate)
    cube.rotation.x += 0.1
    cube.rotation.y += 0.1
    renderer.render(scene,camera)
}

animate()