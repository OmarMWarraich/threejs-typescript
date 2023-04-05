/* 
*  Description
*
*  Animation can also be achieved using a Physics library. Lib called Cannon-es needs to be installed.
*  Cannon physics library ideal for simulatting rigid bodies. Dont have to use it with three.js. but can be.
*  We will use it to make objects move/interact in a more realistic way and provide collision detection possibilities.
*  
*  Basic Concepts
* - Rigid Body: A body w shape and other props such as mass and inertia that can be simulated by a physics engine.
* - Shape: A shape is a volume that can be used to define a rigid body.
* - Constraint: A 3D body has 6 degrees of freedom, 3 for position and three to describe the rotation vector.
*               A constraint is a limit on one of these degrees of freedom.
* - Contact Constraint: A type of constraint to simulate friction and restitution. These are like the faces of an object
*                       where the constraint is applied.
* - World: A world is a container for rigid bodies and constraints. It also has a gravity vector and a broadphase.
* - Broadphase: A broadphase is a method to quickly find all the bodies that might be colliding.
* - Solver: A solver is a method to compute the forces that should be applied to the bodies to satisfy the constraints. 
*
*  Collision Detection
*  Collision detection is the process of finding pairs of objects that are in contact. Various algorithms can be used to
*  find these pairs as it is a computationally expensive process.
*  
* - Narrowphase: Outright body vs body collision detection. This is the most computationally expensive.
* - Broadphase: Is a compromise on Narrowphase where various other techniques can be used to improve performance.
* 
*  Cannon-es provides serveral options for broadphase detection.
* - NaiveBroadphase: A simple brute force algorithm. It checks all pairs of bodies. This is the slowest but most accurate.
* - SAPBroadphase: A sweep and prune algorithm. It sorts the bodies along the x axis and then checks for overlaps.
* - GridBroadphase: A grid based algorithm. It divides the world into a grid and then checks for overlaps.
*
* Iterations
*
* The solver algorithm is run multiple times per step. This is to improve the stability of the simulation.
* The number of iterations can be set for each constraint type.
* The default solver iterations is 10 for contacts and 4 for friction.
*
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import * as CANNON from 'cannon-es'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light1 = new THREE.SpotLight()
light1.position.set(2.5, 5, 5)
light1.angle = Math.PI / 4
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 20
scene.add(light1)

const light2 = new THREE.SpotLight()
light2.position.set(-2.5, 5, 5)
light2.angle = Math.PI / 4
light2.penumbra = 0.5
light2.castShadow = true
light2.shadow.mapSize.width = 1024
light2.shadow.mapSize.height = 1024
light2.shadow.camera.near = 0.5
light2.shadow.camera.far = 20
scene.add(light2)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0, 2, 4)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.y = 0.5

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
// world.broadphase = new CANNON.NaiveBroadphase()
// ;(world.solver as CANNON.GSSolver).iterations = 10
// world.allowSleep = true

const normalMaterial = new THREE.MeshNormalMaterial()
const phongMaterial = new THREE.MeshPhongMaterial()

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMesh = new THREE.Mesh(cubeGeometry, normalMaterial)
cubeMesh.position.x = -3
cubeMesh.position.y = 3
cubeMesh.castShadow = true
scene.add(cubeMesh)
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
const cubeBody = new CANNON.Body({ mass: 1 })
cubeBody.addShape(cubeShape)
cubeBody.position.x = cubeMesh.position.x
cubeBody.position.y = cubeMesh.position.y
cubeBody.position.z = cubeMesh.position.z
world.addBody(cubeBody)

const sphereGeometry = new THREE.SphereGeometry()
const sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial)
sphereMesh.position.x = -1
sphereMesh.position.y = 3
sphereMesh.castShadow = true
scene.add(sphereMesh)
const sphereShape = new CANNON.Sphere(1)
const sphereBody = new CANNON.Body({ mass: 1 })
sphereBody.addShape(sphereShape)
sphereBody.position.x = sphereMesh.position.x
sphereBody.position.y = sphereMesh.position.y
sphereBody.position.z = sphereMesh.position.z
world.addBody(sphereBody)

const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
const icosahedronMesh = new THREE.Mesh(icosahedronGeometry, normalMaterial)
icosahedronMesh.position.x = 1
icosahedronMesh.position.y = 3
icosahedronMesh.castShadow = true
scene.add(icosahedronMesh)
const position = (icosahedronMesh.geometry.attributes.position as THREE.BufferAttribute).array
const icosahedronPoints: CANNON.Vec3[] = []
for (let i = 0; i < position.length; i += 3) {
    icosahedronPoints.push(
        new CANNON.Vec3(position[i], position[i + 1], position[i + 2])
    )
}
const icosahedronFaces: number[][] = []
for (let i = 0; i < position.length / 3; i += 3) {
    icosahedronFaces.push([i, i + 1, i + 2])
}
const icosahedronShape = new CANNON.ConvexPolyhedron({
    vertices: icosahedronPoints,
    faces: icosahedronFaces,
})
const icosahedronBody = new CANNON.Body({ mass: 1 })
icosahedronBody.addShape(icosahedronShape)
icosahedronBody.position.x = icosahedronMesh.position.x
icosahedronBody.position.y = icosahedronMesh.position.y
icosahedronBody.position.z = icosahedronMesh.position.z
world.addBody(icosahedronBody)

const torusKnotGeometry = new THREE.TorusKnotGeometry()
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, normalMaterial)
torusKnotMesh.position.x = 4
torusKnotMesh.position.y = 3
torusKnotMesh.castShadow = true
scene.add(torusKnotMesh)
// position = (torusKnotMesh.geometry.attributes.position as THREE.BufferAttribute).array
// const torusKnotPoints: CANNON.Vec3[] = []
// for (let i = 0; i < position.length; i += 3) {
//     torusKnotPoints.push(new CANNON.Vec3(position[i], position[i + 1], position[i + 2]));
// }
// const torusKnotFaces: number[][] = []
// for (let i = 0; i < position.length / 3; i += 3) {
//     torusKnotFaces.push([i, i + 1, i + 2])
// }
// const torusKnotShape = new CANNON.ConvexPolyhedron(torusKnotPoints, torusKnotFaces)
const torusKnotShape = CreateTrimesh(torusKnotMesh.geometry)
const torusKnotBody = new CANNON.Body({ mass: 1 })
torusKnotBody.addShape(torusKnotShape)
torusKnotBody.position.x = torusKnotMesh.position.x
torusKnotBody.position.y = torusKnotMesh.position.y
torusKnotBody.position.z = torusKnotMesh.position.z
world.addBody(torusKnotBody)

function CreateTrimesh(geometry: THREE.BufferGeometry) {
    const vertices = (geometry.attributes.position as THREE.BufferAttribute).array
    const indices = Object.keys(vertices).map(Number)
    return new CANNON.Trimesh(vertices as [], indices)
}

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial)
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
scene.add(planeMesh)
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0 })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

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
const physicsFolder = gui.addFolder('Physics')

const worldGravity = {
    x: world.gravity.x,
    y: world.gravity.y,
    z: world.gravity.z,
}

physicsFolder.add(worldGravity, 'x', -10.0, 10.0, 0.1)
physicsFolder.add(worldGravity, 'y', -10.0, 10.0, 0.1)
physicsFolder.add(worldGravity, 'z', -10.0, 10.0, 0.1)
physicsFolder.open()

const clock = new THREE.Clock()
let delta

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    //delta = clock.getDelta()
    delta = Math.min(clock.getDelta(), 0.1)
    world.step(delta)

    // Copy coordinates from Cannon to Three.js
    cubeMesh.position.set(
        cubeBody.position.x,
        cubeBody.position.y,
        cubeBody.position.z
    )
    cubeMesh.quaternion.set(
        cubeBody.quaternion.x,
        cubeBody.quaternion.y,
        cubeBody.quaternion.z,
        cubeBody.quaternion.w
    )
    sphereMesh.position.set(
        sphereBody.position.x,
        sphereBody.position.y,
        sphereBody.position.z
    )
    sphereMesh.quaternion.set(
        sphereBody.quaternion.x,
        sphereBody.quaternion.y,
        sphereBody.quaternion.z,
        sphereBody.quaternion.w
    )
    icosahedronMesh.position.set(
        icosahedronBody.position.x,
        icosahedronBody.position.y,
        icosahedronBody.position.z
    )
    icosahedronMesh.quaternion.set(
        icosahedronBody.quaternion.x,
        icosahedronBody.quaternion.y,
        icosahedronBody.quaternion.z,
        icosahedronBody.quaternion.w
    )
    torusKnotMesh.position.set(
        torusKnotBody.position.x,
        torusKnotBody.position.y,
        torusKnotBody.position.z
    )
    torusKnotMesh.quaternion.set(
        torusKnotBody.quaternion.x,
        torusKnotBody.quaternion.y,
        torusKnotBody.quaternion.z,
        torusKnotBody.quaternion.w
    )

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()





