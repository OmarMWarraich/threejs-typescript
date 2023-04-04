import * as THREE from 'three'
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
const material = new THREE.MeshNormalMaterial()

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const controls = new TransformControls(camera, renderer.domElement)
controls.attach(cube)
scene.add(controls)

window.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'KeyG':
            controls.setMode('translate')
            break
        case 'KeyR':
            controls.setMode('rotate')
            break
        case 'KeyS':
            controls.setMode('scale')
            break
    }
})

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
