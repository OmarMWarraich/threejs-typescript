/* 
*  Description
*
*  Sometimes you only need a simple positional transform to occur over time. The tween library works very well, but it could be
*  over engineering if you don't actually need all the features that it offers.
*  If you only want to move an object from A to B and, and nothing else then you can use the Vector3 .lerp and .lerpVectors methods.
*
*  (method) Vector3.lerp(v1: THREE.Vector3, alpha: number): THREE.Vector3
*  (method) Vector3.lerpVectors(v1: THREE.Vector3, v2: THREE.Vector3, alpha: number): THREE.Vector3
*
*  eg,
*  cube.position.lerp(new THREE.Vector3(1, 2, 3), 0.05)
*  v1 : Is the vector to lerp towards.
*  alpha : Is the percent distance along the line from the current vector to the v1.
*  v2 : If using .lerpVectors, then you can set an alternate start vector3 to lerp from rather that the current vector3.
*  Calling .lerp during an animation loop will appear to mimic a Tween using a TWEEN.Easing.Cubic.Out
*  Calling .lerpVectors is useful if you want to slide an object along an arbitrary line depending on the alpha value. Amongst other things.
*  Set alpha to low number such as 0.1, and the vector will appear to lerp more slowly, slowing down as it gets closer to the target vector.
*  Set alpha to 1.0, and the tween will happen instantly in one render cycle.
*  Double-click on the floor in the example to see a slower lerp. Then experiment with the alphas to see a faster lerp and slide a second 
*  cube along a line between the first cube and the starting position.
*
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(1, 2, 5)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xaec6cf, wireframe: true })
)
floor.rotateX(-Math.PI / 2)
scene.add(floor)

const geometry = new THREE.BoxGeometry()
//the cube used for .lerp
const cube1 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
)
cube1.position.y = 0.5
scene.add(cube1)

//the cube used for .lerpVectors
const cube2 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
)
cube2.position.y = 0.5
scene.add(cube2)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const raycaster = new THREE.Raycaster()
let v1 = new THREE.Vector3(2, 0.5, 2)
let v2 = new THREE.Vector3(0, 0.5, 0)
const mouse = new THREE.Vector2()

function onDoubleClick(event: THREE.Event) {
    mouse.set(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObject(floor, false)
    if (intersects.length > 0) {
        v1 = intersects[0].point
        v1.y += 0.5 //raise it so it appears to sit on grid
        //console.log(v1)
    }
}
renderer.domElement.addEventListener('dblclick', onDoubleClick, false)

const stats = new Stats()
document.body.appendChild(stats.dom)
const data = {
    lerpAlpha: 0.1,
    lerpVectorsAlpha: 1.0,
}
const gui = new GUI()

const lerpFolder = gui.addFolder('.lerp')
lerpFolder.add(data, 'lerpAlpha', 0, 1.0, 0.01)
lerpFolder.open()

const lerpVectorsFolder = gui.addFolder('.lerpVectors')
lerpVectorsFolder.add(data, 'lerpVectorsAlpha', 0, 1.0, 0.01)
lerpVectorsFolder.open()

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    cube1.position.lerp(v1, data.lerpAlpha)
    cube2.position.lerpVectors(v1, v2, data.lerpVectorsAlpha)
    controls.target.copy(cube1.position)
    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()





