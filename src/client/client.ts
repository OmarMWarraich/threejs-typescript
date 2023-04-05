import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
scene.background = new THREE.CubeTextureLoader().load([
    'img/materialTextures2/px_eso0932a.jpg',
    'img/materialTextures2/nx_eso0932a.jpg',
    'img/materialTextures2/py_eso0932a.jpg',
    'img/materialTextures2/ny_eso0932a.jpg',
    'img/materialTextures2/pz_eso0932a.jpg',
    'img/materialTextures2/nz_eso0932a.jpg',
])

const ambientLight = new THREE.AmbientLight(0xaaaaaa)
scene.add(ambientLight)

const light1 = new THREE.DirectionalLight()
light1.position.set(5, 10, 5)
light1.castShadow = true
light1.shadow.bias = -0.0002
light1.shadow.mapSize.height = 1024
light1.shadow.mapSize.width = 1024
light1.shadow.camera.left = -10
light1.shadow.camera.right = 10
light1.shadow.camera.top = 10
light1.shadow.camera.bottom = -10
scene.add(light1)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    100
)
camera.position.set(0, 8, 0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const texture = new THREE.TextureLoader().load('img/grid.png')
const plane: THREE.Mesh = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshPhongMaterial({ map: texture })
)
plane.rotateX(-Math.PI / 2)
plane.receiveShadow = true
scene.add(plane)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const cubeRenderTarget1: THREE.WebGLCubeRenderTarget =
    new THREE.WebGLCubeRenderTarget(128, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
    })
const cubeRenderTarget2: THREE.WebGLCubeRenderTarget =
    new THREE.WebGLCubeRenderTarget(128, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
    })
const cubeRenderTarget3: THREE.WebGLCubeRenderTarget =
    new THREE.WebGLCubeRenderTarget(128, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
    })
const cubeCamera1: THREE.CubeCamera = new THREE.CubeCamera(
    0.1,
    1000,
    cubeRenderTarget1
)
const cubeCamera2: THREE.CubeCamera = new THREE.CubeCamera(
    0.1,
    1000,
    cubeRenderTarget2
)
const cubeCamera3: THREE.CubeCamera = new THREE.CubeCamera(
    0.1,
    1000,
    cubeRenderTarget3
)

const pivot1 = new THREE.Object3D()
scene.add(pivot1)
const pivot2 = new THREE.Object3D()
scene.add(pivot2)
const pivot3 = new THREE.Object3D()
scene.add(pivot3)

const material1 = new THREE.MeshPhongMaterial({
    shininess: 100,
    color: 0xffffff,
    specular: 0xffffff,
    envMap: cubeRenderTarget1.texture,
    refractionRatio: 0.5,
    transparent: true,
    side: THREE.BackSide,
    combine: THREE.MixOperation,
})
const material2 = new THREE.MeshPhongMaterial({
    shininess: 100,
    color: 0xffffff,
    specular: 0xffffff,
    envMap: cubeRenderTarget2.texture,
    refractionRatio: 0.5,
    transparent: true,
    side: THREE.BackSide,
    combine: THREE.MixOperation,
})
const material3 = new THREE.MeshPhongMaterial({
    shininess: 100,
    color: 0xffffff,
    specular: 0xffffff,
    envMap: cubeRenderTarget3.texture,
    refractionRatio: 0.5,
    transparent: true,
    side: THREE.BackSide,
    combine: THREE.MixOperation,
})

cubeRenderTarget1.texture.mapping = THREE.CubeRefractionMapping
cubeRenderTarget2.texture.mapping = THREE.CubeRefractionMapping
cubeRenderTarget3.texture.mapping = THREE.CubeRefractionMapping

const ball1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material1)
ball1.position.set(1, 1.1, 0)
ball1.castShadow = true
ball1.receiveShadow = true
ball1.add(cubeCamera1)
pivot1.add(ball1)

const ball2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material2)
ball2.position.set(3.1, 1.1, 0)
ball2.castShadow = true
ball2.receiveShadow = true
ball2.add(cubeCamera2)
pivot2.add(ball2)

const ball3 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material3)
ball3.position.set(5.2, 1.1, 0)
ball3.castShadow = true
ball3.receiveShadow = true
ball3.add(cubeCamera3)
pivot3.add(ball3)

const data = { refractionRatio: 0 }

const gui = new GUI()
const refractionFolder = gui.addFolder('Refraction')
refractionFolder
    .add(data, 'refractionRatio', 0, 1, 0.01)
    .onChange((v: number) => {
        material1.refractionRatio = v
        material2.refractionRatio = v
        material3.refractionRatio = v
    })
refractionFolder.open()

const stats = new Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()
    ball1.rotateY(-0.2 * delta)
    pivot1.rotateY(0.2 * delta)
    ball2.rotateY(-0.3 * delta)
    pivot2.rotateY(0.3 * delta)
    ball3.rotateY(-0.4 * delta)
    pivot3.rotateY(0.4 * delta)

    orbitControls.update()

    render()

    stats.update()
}

function render() {
    ball1.visible = false
    cubeCamera1.update(renderer, scene)
    ball1.visible = true
    ball2.visible = false
    cubeCamera2.update(renderer, scene)
    ball2.visible = true
    ball3.visible = false
    cubeCamera3.update(renderer, scene)
    ball3.visible = true

    renderer.render(scene, camera)
}

animate()
