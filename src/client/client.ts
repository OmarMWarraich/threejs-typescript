/* 
* Description
* 
*  This is a basic example of using the Raycaster to mouse pick objects in the scene.
*  The scene is traversed and all individual objects are added to the pickableObjects 
*  array that is used by the Raycaster. The sphere and plane are deliberately excluded
*  from this so they will not be mouse picked.
*
*  The plane also receives shadows while everything else only casts shadows.
* 
*  This example demonstrates,
* 
*  Loading a GLB scene, traversing the child objects to individually add and/or copy
*  properties for later use.
*  Using the Raycaster to detect if the mouse is over certain objects and changing
*  there material.
* 
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.SpotLight()
light.position.set(12.5, 12.5, 12.5)
light.castShadow = true
light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(15, 15, 15)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const pickableObjects: THREE.Mesh[] = []
let intersectedObject: THREE.Object3D | null
const originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } =
    {}
const highlightedMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x00ff00,
})

const loader = new GLTFLoader()
loader.load(
    'models/model9/simplescene.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh
                //the sphere and plane will not be mouse picked. THe plane will receive shadows while everything else casts shadows.
                switch (m.name) {
                    case 'Plane':
                        m.receiveShadow = true
                        break
                    case 'Sphere':
                        m.castShadow = true
                        break
                    default:
                        m.castShadow = true
                        pickableObjects.push(m)
                        //store reference to original materials for later
                        originalMaterials[m.name] = (m as THREE.Mesh).material
                }
            }
        })
        scene.add(gltf.scene)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const raycaster = new THREE.Raycaster()
let intersects: THREE.Intersection[]

const mouse = new THREE.Vector2()

function onDocumentMouseMove(event: MouseEvent) {
    mouse.set(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
    raycaster.setFromCamera(mouse, camera)
    intersects = raycaster.intersectObjects(pickableObjects, false)

    if (intersects.length > 0) {
        intersectedObject = intersects[0].object
    } else {
        intersectedObject = null
    }
    pickableObjects.forEach((o: THREE.Mesh, i) => {
        if (intersectedObject && intersectedObject.name === o.name) {
            pickableObjects[i].material = highlightedMaterial
        } else {
            pickableObjects[i].material = originalMaterials[o.name]
        }
    })
}
document.addEventListener('mousemove', onDocumentMouseMove, false)

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

