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
camera.position.x = 4
camera.position.y = 4
camera.position.z = 4

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(8, 0, 0)
//controls.addEventListener('change', render)

const light1 = new THREE.PointLight()
light1.position.set(10, 10, 10)
scene.add(light1)

const light2 = new THREE.PointLight()
light2.position.set(-10, 10, 10)
scene.add(light2)

const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
)
object1.position.set(4, 0, 0)
scene.add(object1)
object1.add(new THREE.AxesHelper(5))

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshPhongMaterial({ color: 0x00ff00 })
)
object2.position.set(4, 0, 0)
object1.add(object2)
object2.add(new THREE.AxesHelper(5))

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshPhongMaterial({ color: 0x0000ff })
)
object3.position.set(4, 0, 0)
object2.add(object3)
object3.add(new THREE.AxesHelper(5))

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const gui = new GUI()
const object1Folder = gui.addFolder('Object1')
const object1Position = {
    x: object1.position.x,
}
object1Folder.add(object1Position, 'x', 10, 0.01).name('X Position')
const object1Rotation = {
    x: object1.rotation.x,
}
object1Folder
    .add(object1Rotation, 'x', 0, Math.PI * 2, 0.01)
    .name('X Rotation')
const object1Scale = {
    x: object1.scale.x,
}
object1Folder.add(object1Scale, 'x', 0, 10, 0.01).name('X Scale')
object1Folder.open()

const object2Folder = gui.addFolder('Object2')
const object2Position = {
    x: object2.position.x,
}
object2Folder.add(object2Position, 'x', 10, 0.01).name('X Position')
const object2Rotation = {
    x: object2.rotation.x,
}
object2Folder
    .add(object2Rotation, 'x', 0, Math.PI * 2, 0.01)
    .name('X Rotation')
const object2Scale = {
    x: object2.scale.x,
}
object2Folder.add(object2Scale, 'x', 0, 10, 0.01).name('X Scale')
object2Folder.open()

const object3Folder = gui.addFolder('Object3')
const object3Position = {
    x: object3.position.x,
}
object3Folder.add(object3Position, 'x', 10, 0.01).name('X Position')
const object3Rotation = {
    x: object3.rotation.x,
}
object3Folder
    .add(object3Rotation, 'x', 0, Math.PI * 2, 0.01)
    .name('X Rotation')
const object3Scale = {
    x: object3.scale.x,
}
object3Folder.add(object3Scale, 'x', 0, 10, 0.01).name('X Scale')
object3Folder.open()

const stats = new Stats()
document.body.appendChild(stats.dom)

const debug = document.getElementById('debug1') as HTMLDivElement

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
    const object1WorldPosition = new THREE.Vector3()
    object1.getWorldPosition(object1WorldPosition)
    const object2WorldPosition = new THREE.Vector3()
    object2.getWorldPosition(object2WorldPosition)
    const object3WorldPosition = new THREE.Vector3()
    object3.getWorldPosition(object3WorldPosition)
    debug.innerText =
        'Red\n' +
        'Local Pos X : ' +
        object1.position.x.toFixed(2) +
        '\n' +
        'World Pos X : ' +
        object1WorldPosition.x.toFixed(2) +
        '\n' +
        '\nGreen\n' +
        'Local Pos X : ' +
        object2.position.x.toFixed(2) +
        '\n' +
        'World Pos X : ' +
        object2WorldPosition.x.toFixed(2) +
        '\n' +
        '\nBlue\n' +
        'Local Pos X : ' +
        object3.position.x.toFixed(2) +
        '\n' +
        'World Pos X : ' +
        object3WorldPosition.x.toFixed(2) +
        '\n'
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()