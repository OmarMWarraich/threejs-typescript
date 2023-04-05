/* 
* Description
* While raycasting is almost always used for mouse picking objects in the 3D scene, it can also be used for simple collision detection.
* In this example, I detect whether the orbit controls will penetrate another object and adjust the cameras position so that it stays outside.
* Essentially, I am creating a ray from the camera target to the camera position. If there is an intersected object between, then the camera
* position is adjusted to the intersect point. This prevents the camera from going behind a wall, or inside a box, or floor, or any object 
* which is part of the objects array being tested for an intersect.
* 
*  Also, instead of using the raycaster to find the new point to position the camera in case of collision between the target and itself, 
*  I could instead modify the opacity of the object in between and not move the camera. Rotate the camera and notice how any object between
*  the camera target and the camera itself, becomes transparent.
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()

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

const raycaster = new THREE.Raycaster()
const sceneMeshes: THREE.Mesh[] = []
const dir = new THREE.Vector3()
let intersects: THREE.Intersection[] = []

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.addEventListener('change', function () {
    xLine.position.copy(controls.target)
    yLine.position.copy(controls.target)
    zLine.position.copy(controls.target)

    raycaster.set(
        controls.target,
        dir.subVectors(camera.position, controls.target).normalize()
    )

    intersects = raycaster.intersectObjects(sceneMeshes, false)
    if (intersects.length > 0) {
        if (
            intersects[0].distance < controls.target.distanceTo(camera.position)
        ) {
            camera.position.copy(intersects[0].point)
        }
    }
})

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
)
floor.rotateX(-Math.PI / 2)
floor.position.y = -1
scene.add(floor)
sceneMeshes.push(floor)

const wall1 = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
)
wall1.position.x = 4
wall1.rotateY(-Math.PI / 2)
scene.add(wall1)
sceneMeshes.push(wall1)

const wall2 = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
)
wall2.position.z = -3
scene.add(wall2)
sceneMeshes.push(wall2)

const cube: THREE.Mesh = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshNormalMaterial()
)
cube.position.set(-3, 0, 0)
scene.add(cube)
sceneMeshes.push(cube)

const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
)
ceiling.rotateX(Math.PI / 2)
ceiling.position.y = 3
scene.add(ceiling)
sceneMeshes.push(ceiling)

//crosshair
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff,
})
const points: THREE.Vector3[] = []
points[0] = new THREE.Vector3(-0.1, 0, 0)
points[1] = new THREE.Vector3(0.1, 0, 0)
let lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
const xLine = new THREE.Line(lineGeometry, lineMaterial)
scene.add(xLine)
points[0] = new THREE.Vector3(0, -0.1, 0)
points[1] = new THREE.Vector3(0, 0.1, 0)
lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
const yLine = new THREE.Line(lineGeometry, lineMaterial)
scene.add(yLine)
points[0] = new THREE.Vector3(0, 0, -0.1)
points[1] = new THREE.Vector3(0, 0, 0.1)
lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
const zLine = new THREE.Line(lineGeometry, lineMaterial)
scene.add(zLine)

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

    controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
