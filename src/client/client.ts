/* 
*  Description
*
*  Collision Detection using OBB: Oriented Bounding Box
*
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OBB } from 'three/examples/jsm/math/OBB'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.AmbientLight()
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0.8, 1.4, 3.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const geometry = new THREE.BoxGeometry(1, 2, 3)
geometry.computeBoundingBox()
const material = new THREE.MeshPhongMaterial()
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(4, 1, 0)
mesh.geometry.userData.obb = new OBB().fromBox3(
    mesh.geometry.boundingBox as THREE.Box3
)
mesh.userData.obb = new OBB()
scene.add(mesh)

const mesh2 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
)
mesh2.position.set(-3, 1, 0)
mesh2.geometry.userData.obb = new OBB().fromBox3(
    mesh2.geometry.boundingBox as THREE.Box3
)
mesh2.userData.obb = new OBB()

scene.add(mesh2)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xaec6cf, wireframe: true })
)
floor.rotateX(-Math.PI / 2)
scene.add(floor)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)

    mesh.position.x = Math.sin(clock.getElapsedTime() * 0.5) * 4

    controls.update()

    mesh.userData.obb.copy(mesh.geometry.userData.obb)
    mesh2.userData.obb.copy(mesh2.geometry.userData.obb)
    mesh.userData.obb.applyMatrix4(mesh.matrixWorld)
    mesh2.userData.obb.applyMatrix4(mesh2.matrixWorld)
    if (mesh.userData.obb.intersectsOBB(mesh2.userData.obb)) {
        mesh.material.color.set(0xff0000)
    } else {
        mesh.material.color.set(0x00ff00)
    }

    mesh.rotateY(0.01)
    mesh2.rotateY(-0.005)

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()


