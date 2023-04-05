/* 
*  Description
*
*  Tweenjs is a JavaScript tweening engine.
*
*  This example demonstrates,
*
*  A tween (from in-between) is a concept that allows you to change the values of the properties of an object smoothly.
*  We can decide how long it should take, and if there should be a delay, and what to do each time the tween is updated,
*  whether it should repeat and other things.
* 
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import TWEEN from '@tweenjs/tween.js'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
//renderer.physicallyCorrectLights = true //deprecated
renderer.useLegacyLights = false //use this instead of setting physicallyCorrectLights=true property
renderer.shadowMap.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const sceneMeshes: THREE.Mesh[] = []
let monkey: THREE.Mesh

const loader = new GLTFLoader()
loader.load(
    'models/model5/monkey_textured.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                let m = child as THREE.Mesh
                m.receiveShadow = true
                m.castShadow = true
                if (child.name === 'Plane') {
                    sceneMeshes.push(m)
                } else if (child.name === 'Suzanne') {
                    monkey = m
                }
            }
            if ((child as THREE.Light).isLight) {
                const l = child as THREE.Light
                l.castShadow = true
                l.shadow.bias = -0.003
                l.shadow.mapSize.width = 2048
                l.shadow.mapSize.height = 2048
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

        //controls.target.set(p.x, p.y, p.z)

        // new TWEEN.Tween(controls.target)
        //     .to({
        //         x: p.x,
        //         y: p.y,
        //         z: p.z
        //     }, 500)
        //     //.delay (1000)
        //     .easing(TWEEN.Easing.Cubic.Out)
        //     //.onUpdate(() => render())
        //     .start()

        new TWEEN.Tween(monkey.position)
            .to(
                {
                    x: p.x,
                    // y: p.y + 1,
                    z: p.z,
                },
                500
            )
            .start()

        new TWEEN.Tween(monkey.position)
            .to(
                {
                    // x: p.x,
                    y: p.y + 3,
                    // z: p.z,
                },
                250
            )
            //.delay (1000)
            .easing(TWEEN.Easing.Cubic.Out)
            //.onUpdate(() => render())
            .start()
            .onComplete(() => {
                new TWEEN.Tween(monkey.position)
                    .to(
                        {
                            // x: p.x,
                            y: p.y + 1,
                            // z: p.z,
                        },
                        250
                    )
                    //.delay (250)
                    .easing(TWEEN.Easing.Bounce.Out)
                    //.onUpdate(() => render())
                    .start()
            })
    }
}
renderer.domElement.addEventListener('dblclick', onDoubleClick, false)

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


