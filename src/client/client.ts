/* 
*  Description
*
*  Using the Raycaster to assist in measuring the distance between points.
*
*  This example demonstrates,
*
*   Using the Raycaster, along with pointer events to start and draw a line 
*   from point A to B.
*
*   Using the CSS2DRenderer and CSS2DObject to create measurement labels.
*   Using Vector3.lerpVectors to position a label between 2 points.
* 
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'

const scene = new THREE.Scene()

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

const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(labelRenderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const pickableObjects: THREE.Mesh[] = []

const loader = new GLTFLoader()
loader.load(
    'models/model9/simplescene.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh
                switch (m.name) {
                    case 'Plane':
                        m.receiveShadow = true
                        break
                    default:
                        m.castShadow = true
                }
                pickableObjects.push(m)
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
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

let ctrlDown = false
let lineId = 0
let line: THREE.Line
let drawingLine = false
const measurementLabels: { [key: number]: CSS2DObject } = {}

window.addEventListener('keydown', function (event) {
    if (event.key === 'Control') {
        ctrlDown = true
        controls.enabled = false
        renderer.domElement.style.cursor = 'crosshair'
    }
})

window.addEventListener('keyup', function (event) {
    if (event.key === 'Control') {
        ctrlDown = false
        controls.enabled = true
        renderer.domElement.style.cursor = 'pointer'
        if (drawingLine) {
            //delete the last line because it wasn't committed
            scene.remove(line)
            scene.remove(measurementLabels[lineId])
            drawingLine = false
        }
    }
})

const raycaster = new THREE.Raycaster()
let intersects: THREE.Intersection[]
const mouse = new THREE.Vector2()

renderer.domElement.addEventListener('pointerdown', onClick, false)
function onClick() {
    if (ctrlDown) {
        raycaster.setFromCamera(mouse, camera)
        intersects = raycaster.intersectObjects(pickableObjects, false)
        if (intersects.length > 0) {
            if (!drawingLine) {
                //start the line
                const points = []
                points.push(intersects[0].point)
                points.push(intersects[0].point.clone())
                const geometry = new THREE.BufferGeometry().setFromPoints(
                    points
                )
                line = new THREE.LineSegments(
                    geometry,
                    new THREE.LineBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.75,
                        // depthTest: false,
                        // depthWrite: false
                    })
                )
                line.frustumCulled = false
                scene.add(line)

                const measurementDiv = document.createElement(
                    'div'
                ) as HTMLDivElement
                measurementDiv.className = 'measurementLabel'
                measurementDiv.innerText = '0.0m'
                const measurementLabel = new CSS2DObject(measurementDiv)
                measurementLabel.position.copy(intersects[0].point)
                measurementLabels[lineId] = measurementLabel
                scene.add(measurementLabels[lineId])
                drawingLine = true
            } else {
                //finish the line
                const positions = (
                    line.geometry.attributes.position as THREE.BufferAttribute
                ).array as Array<number>
                positions[3] = intersects[0].point.x
                positions[4] = intersects[0].point.y
                positions[5] = intersects[0].point.z
                line.geometry.attributes.position.needsUpdate = true
                lineId++
                drawingLine = false
            }
        }
    }
}

document.addEventListener('mousemove', onDocumentMouseMove, false)
function onDocumentMouseMove(event: MouseEvent) {
    event.preventDefault()

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    if (drawingLine) {
        raycaster.setFromCamera(mouse, camera)
        intersects = raycaster.intersectObjects(pickableObjects, false)
        if (intersects.length > 0) {
            const positions = (
                line.geometry.attributes.position as THREE.BufferAttribute
            ).array as Array<number>
            const v0 = new THREE.Vector3(
                positions[0],
                positions[1],
                positions[2]
            )
            const v1 = new THREE.Vector3(
                intersects[0].point.x,
                intersects[0].point.y,
                intersects[0].point.z
            )
            positions[3] = intersects[0].point.x
            positions[4] = intersects[0].point.y
            positions[5] = intersects[0].point.z
            line.geometry.attributes.position.needsUpdate = true
            const distance = v0.distanceTo(v1)
            measurementLabels[lineId].element.innerText =
                distance.toFixed(2) + 'm'
            measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5)
        }
    }
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
    labelRenderer.render(scene, camera)
    renderer.render(scene, camera)
}

animate()
