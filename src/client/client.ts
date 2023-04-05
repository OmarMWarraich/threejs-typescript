import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { Reflector } from 'three/examples/jsm/objects/Reflector'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light1 = new THREE.PointLight()
light1.position.set(2.5, 2.5, 2.5)
light1.castShadow = true
scene.add(light1)

const light2 = new THREE.PointLight()
light2.position.set(-2.5, 2.5, 2.5)
light2.castShadow = true
scene.add(light2)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
)
camera.position.set(0.8, 1.4, 1.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableDamping = true
orbitControls.target.set(0, 1, 0)

const sceneMeshes: THREE.Mesh[] = []
let boxHelper: THREE.BoxHelper;

const dragControls = new DragControls(sceneMeshes, camera, renderer.domElement)
dragControls.addEventListener('hoveron', function () {
    boxHelper.visible = true
    orbitControls.enabled = false
})
dragControls.addEventListener('hoveroff', function () {
    boxHelper.visible = false
    orbitControls.enabled = true
})
dragControls.addEventListener('drag', function (event) {
    event.object.position.y = 0
})
dragControls.addEventListener('dragstart', function () {
    boxHelper.visible = true
    orbitControls.enabled = false
})
dragControls.addEventListener('dragend', function () {
    boxHelper.visible = false
    orbitControls.enabled = true
})

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const texture = new THREE.TextureLoader().load('img/grid.png')
const plane: THREE.Mesh = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshPhongMaterial({ map: texture })
)
plane.rotateX(-Math.PI / 2)
plane.receiveShadow = true
scene.add(plane)

let mixer: THREE.AnimationMixer
let modelReady = false
const gltfLoader: GLTFLoader = new GLTFLoader()
let modelGroup: THREE.Group = new THREE.Group()
let modelDragBox: THREE.Mesh

gltfLoader.load(
    'models/model8/eve@punching.glb',
    (gltf) => {
        gltf.scene.traverse(function (child) {
            if (child instanceof THREE.Group) {
                modelGroup = child
            }
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true
                child.frustumCulled = false
                ;(child as THREE.Mesh).geometry.computeVertexNormals()
            }
        })

        mixer = new THREE.AnimationMixer(gltf.scene)
        mixer.clipAction((gltf as any).animations[0]).play()

        modelDragBox = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 1.3, 0.5),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        )
        modelDragBox.geometry.translate(0, 0.65, 0)
        scene.add(modelDragBox)
        sceneMeshes.push(modelDragBox)

        boxHelper = new THREE.BoxHelper(modelDragBox, 0xffff00)
        boxHelper.visible = false
        scene.add(boxHelper)

        scene.add(gltf.scene)

        modelReady = true
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

const mirrorBack1: Reflector = new Reflector(
    new THREE.PlaneGeometry(2, 2),
    {
        color: new THREE.Color(0x7f7f7f),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio
    }
)

mirrorBack1.position.y = 1
mirrorBack1.position.z = -1
scene.add(mirrorBack1)

const mirrorBack2: Reflector = new Reflector(
    new THREE.PlaneGeometry(2, 2),
    {
        color: new THREE.Color(0x7f7f7f),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio
    }
)

mirrorBack2.position.y = 1
mirrorBack2.position.z = -2
scene.add(mirrorBack2)

const mirrorFront1: Reflector = new Reflector(
    new THREE.PlaneGeometry(2, 2),
    {
        color: new THREE.Color(0x7f7f7f),
        //clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio
    }
)
mirrorFront1.position.y = 1
mirrorFront1.position.z = 1
mirrorFront1.rotateY(Math.PI)
scene.add(mirrorFront1)

const mirrorFront2: Reflector = new Reflector(
    new THREE.PlaneGeometry(2, 2),
    {
        color: new THREE.Color(0x7f7f7f),
        //clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio
    }
)
mirrorFront2.position.y = 1
mirrorFront2.position.z = 2
mirrorFront2.rotateY(Math.PI)
scene.add(mirrorFront2)

const stats = new Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)

    orbitControls.update()

    if (modelReady) {
        mixer.update(clock.getDelta())
        modelGroup.position.copy(modelDragBox.position)
        boxHelper.update()
    }

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
