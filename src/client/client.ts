import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ transparent: true })

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const orbitControls = new OrbitControls(camera, renderer.domElement)

// const dragControls = new DragControls([cube], camera, renderer.domElement)
// dragControls.addEventListener('dragstart', function (event) {
//     orbitControls.enabled = false
//     event.object.material.opacity = 0.33
// })
// dragControls.addEventListener('dragend', function (event) {
//     orbitControls.enabled = true
//     event.object.material.opacity = 1
// })

const transformControls = new TransformControls(camera, renderer.domElement)
transformControls.attach(cube)
transformControls.setMode('rotate')
scene.add(transformControls)

transformControls.addEventListener('dragging-changed', function (event) {
    orbitControls.enabled = !event.value
    //dragControls.enabled = !event.value
})

window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'g':
            transformControls.setMode('translate')
            break
        case 'r':
            transformControls.setMode('rotate')
            break
        case 's':
            transformControls.setMode('scale')
            break
    }
})

const backGroundTexture = new THREE.CubeTextureLoader().load([
    'img/materialTextures2/px_eso0932a.jpg',
    'img/materialTextures2/nx_eso0932a.jpg',
    'img/materialTextures2/py_eso0932a.jpg',
    'img/materialTextures2/ny_eso0932a.jpg',
    'img/materialTextures2/pz_eso0932a.jpg',
    'img/materialTextures2/nz_eso0932a.jpg',
])
scene.background = backGroundTexture

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
