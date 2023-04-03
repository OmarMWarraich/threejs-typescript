import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

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
//controls.addEventListener('change', render)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
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

const gui = new GUI()
const cubeFolder = gui.addFolder('Cube')
const cubeRotationFolder = cubeFolder.addFolder('Rotation')
const cubeRotation = {
    x: cube.rotation.x,
    y: cube.rotation.y,
    z: cube.rotation.z,
}
cubeRotationFolder.add(cubeRotation, 'x', 0, Math.PI * 2)
cubeRotationFolder.add(cubeRotation, 'y', 0, Math.PI * 2)
cubeRotationFolder.add(cubeRotation, 'z', 0, Math.PI * 2)
cubeFolder.open()
cubeRotationFolder.open()
const cubePositionFolder = cubeFolder.addFolder('Position')
const cubePosition = {
    x: cube.position.x,
    y: cube.position.y,
    z: cube.position.z,
}
cubePositionFolder.add(cubePosition, 'x', -10, 10, 2)
cubePositionFolder.add(cubePosition, 'y', -10, 10, 2)
cubePositionFolder.add(cubePosition, 'z', -10, 10, 2)
cubeFolder.open()
cubePositionFolder.open()
const cubeScaleFolder = cubeFolder.addFolder('Scale')
const cubeScale = {
    x: cube.scale.x,
    y: cube.scale.y,
    z: cube.scale.z,
}
cubeScaleFolder.add(cubeScale, 'x', -5, 5)
cubeScaleFolder.add(cubeScale, 'y', -5, 5)
cubeScaleFolder.add(cubeScale, 'z', -5, 5)
const cubeVisible = {
    visible: cube.visible,
}
cubeFolder.add(cubeVisible, 'visible')
cubeFolder.open()
cubeScaleFolder.open()

function animate() {
    requestAnimationFrame(animate)

    //stats.begin()
    //cube.rotation.x += 0.01
    //cube.rotation.y += 0.01
    //stats.end()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
//render()