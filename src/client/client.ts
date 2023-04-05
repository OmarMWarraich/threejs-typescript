/* 
*  Description
*
*  In this example, I demonstrate using a mixture of the concepts demonstrated in the previous lessons GLTF Loader, Raycaster, tween.js and Orbit Controls.
*
*  The concept of moving the Orbit controls target was discussed and demonstrated in the Using tweens.js video lesson.
*
*  In this example, a glTF scene is imported and when you double-click the floor or monkey head, the Orbit Controls target tweens to the new position. 
*  See the onDoubleClick function in the code below. 
*
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import TWEEN from '@tweenjs/tween.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(-0.6, 0.45, 2)

const renderer = new THREE.WebGLRenderer()
//renderer.physicallyCorrectLights = true //deprecated
renderer.useLegacyLights = false //use this instead of setting physicallyCorrectLights=true property
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const raycaster = new THREE.Raycaster()
const sceneMeshes: THREE.Object3D[] = []

const loader = new GLTFLoader()
loader.load(
    'models/model3/monkey.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh
                if (m.name === 'Suzanne') {
                    m.castShadow = true
                } else {
                    // floor
                    m.receiveShadow = true
                }
                sceneMeshes.push(m)
            }
            if ((child as THREE.Light).isLight) {
                const l = child as THREE.Light
                l.castShadow = true
                l.shadow.bias = -0.001
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

const mouse = new THREE.Vector2()
function onDoubleClick(event: MouseEvent) {
    mouse.set(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(sceneMeshes, false)

    if (intersects.length > 0) {
        const p = intersects[0].point
        new TWEEN.Tween(controls.target)
            .to(
                {
                    x: p.x,
                    y: p.y,
                    z: p.z,
                },
                500
            )
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
    }
}
renderer.domElement.addEventListener('dblclick', onDoubleClick, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
window.addEventListener('resize', onWindowResize, false)

const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    TWEEN.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()




