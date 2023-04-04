import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.y = 1
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const menuPanel = document.getElementById('menuPanel') as HTMLDivElement
const startButton = document.getElementById('startButton') as HTMLInputElement
startButton.addEventListener(
    'click',
    function () {
        controls.lock()
    },
    false
)

const controls = new PointerLockControls(camera, renderer.domElement)
//controls.addEventListener('change', () => console.log("Controls Change"))
controls.addEventListener('lock', () => (menuPanel.style.display = 'none'))
controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'))

const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50)
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})
const plane = new THREE.Mesh(planeGeometry, material)
plane.rotateX(-Math.PI / 2)
scene.add(plane)

const cubes: THREE.Mesh[] = []
for (let i = 0; i < 100; i++) {
    const geo = new THREE.BoxGeometry(
        Math.random() * 4,
        Math.random() * 16,
        Math.random() * 4
    )
    const mat = new THREE.MeshBasicMaterial({ wireframe: true })
    switch (i % 3) {
        case 0:
            mat.color = new THREE.Color(0xff0000)
            break
        case 1:
            mat.color = new THREE.Color(0xffff00)
            break
        case 2:
            mat.color = new THREE.Color(0x0000ff)
            break
    }
    const cube = new THREE.Mesh(geo, mat)
    cubes.push(cube)
}
cubes.forEach((c) => {
    c.position.x = Math.random() * 100 - 50
    c.position.z = Math.random() * 100 - 50
    c.geometry.computeBoundingBox()
    c.position.y =
        ((c.geometry.boundingBox as THREE.Box3).max.y -
            (c.geometry.boundingBox as THREE.Box3).min.y) /
        2
    scene.add(c)
})

const onKeyDown = function (event: KeyboardEvent) {
    switch (event.code) {
        case 'KeyW':
            controls.moveForward(0.25)
            break
        case 'KeyA':
            controls.moveRight(-0.25)
            break
        case 'KeyS':
            controls.moveForward(-0.25)
            break
        case 'KeyD':
            controls.moveRight(0.25)
            break
    }
}
document.addEventListener('keydown', onKeyDown, false)

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

    //controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
