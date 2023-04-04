import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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

const controls = new OrbitControls(camera, renderer.domElement)

// camera.lookAt(0.5, 0.5, 0.5)
// controls.target.set(.5, .5, .5)
// controls.update()

// controls.addEventListener('change', () => console.log("Controls Change"))
// controls.addEventListener('start', () => console.log("Controls Start Event"))
// controls.addEventListener('end', () => console.log("Controls End Event"))
// controls.autoRotate = true
// controls.autoRotateSpeed = 10
// controls.enableDamping = true
// controls.dampingFactor = .01
// controls.enableKeys = true //older versions
// controls.listenToKeyEvents(document.body)
// controls.keys = {
//     LEFT: "ArrowLeft", //left arrow
//     UP: "ArrowUp", // up arrow
//     RIGHT: "ArrowRight", // right arrow
//     BOTTOM: "ArrowDown" // down arrow
// }
// controls.mouseButtons = {
//     LEFT: THREE.MOUSE.ROTATE,
//     MIDDLE: THREE.MOUSE.DOLLY,
//     RIGHT: THREE.MOUSE.PAN
// }
// controls.touches = {
//     ONE: THREE.TOUCH.ROTATE,
//     TWO: THREE.TOUCH.DOLLY_PAN
// }
// controls.screenSpacePanning = true
// controls.minAzimuthAngle = 0
// controls.maxAzimuthAngle = Math.PI / 2
// controls.minPolarAngle = 0
// controls.maxPolarAngle = Math.PI
// controls.maxDistance = 4
// controls.minDistance = 2

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

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

    // controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
