import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(10, 10, 10)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()
//const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true })
//const cube: THREE.Mesh = new THREE.Mesh(geometry, material)
//scene.add(cube)

const material = [
    new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true }),
    new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true }),
    new THREE.MeshPhongMaterial({ color: 0x0000ff, transparent: true })
]

const cubes = [
    new THREE.Mesh(geometry, material[0]),
    new THREE.Mesh(geometry, material[1]),
    new THREE.Mesh(geometry, material[2])
]
cubes[0].position.x = -2
cubes[1].position.x = 0
cubes[2].position.x = 2
cubes.forEach((c) => scene.add(c))

const controls = new DragControls(cubes, camera, renderer.domElement)
// controls.addEventListener('dragstart', function (event) {
//     event.object.material.opacity = 0.33
// })
// controls.addEventListener('dragend', function (event) {
//     event.object.material.opacity = 1
// })

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

    cubes[0].rotation.x += 0.01
    cubes[0].rotation.y += 0.011
    cubes[1].rotation.x += 0.012
    cubes[1].rotation.y += 0.013
    cubes[2].rotation.x += 0.014
    cubes[2].rotation.y += 0.015
    //controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()

