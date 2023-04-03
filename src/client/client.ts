import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight(0xffffff, 2)
light.position.set(10, 10, 10)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const boxGeometry = new THREE.BoxGeometry()
const sphereGeometry = new THREE.SphereGeometry()
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
const planeGeometry = new THREE.PlaneGeometry()
const torusKnotGeometry = new THREE.TorusKnotGeometry()

interface MeshStandardMaterialWithIndex extends THREE.MeshStandardMaterial {
    [key: string]: any;
  }

const material: MeshStandardMaterialWithIndex = new THREE.MeshStandardMaterial()

const texture = new THREE.TextureLoader().load('img/grid.png')
material.map = texture
const pmremGenerator = new THREE.PMREMGenerator(renderer)
const envTexture = new THREE.CubeTextureLoader().load(['img/px_50.png','img/nx_50.png','img/py_50.png','img/ny_50.png','img/pz_50.png','img/nz_50.png'],
    () => {
        material.envMap = pmremGenerator.fromCubemap(envTexture).texture
        pmremGenerator.dispose()
    }
)

const cube = new THREE.Mesh(boxGeometry, material)
cube.position.x = 5
scene.add(cube)

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.x = 3
scene.add(sphere)

const icosahedron = new THREE.Mesh(icosahedronGeometry, material)
icosahedron.position.x = 0
scene.add(icosahedron)

const plane = new THREE.Mesh(planeGeometry, material)
plane.position.x = -2
scene.add(plane)

const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
torusKnot.position.x = -5
scene.add(torusKnot)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

const options = {
    side: {
        FrontSide: THREE.FrontSide,
        BackSide: THREE.BackSide,
        DoubleSide: THREE.DoubleSide,
    },
}

const gui = new GUI()
const materialFolder = gui.addFolder('THREE.Material')
materialFolder.add(material, 'transparent').onChange(() => material.needsUpdate = true)
materialFolder.add(material, 'opacity', 0, 1, 0.01)
materialFolder.add(material, 'depthTest')
materialFolder.add(material, 'depthWrite')
materialFolder
    .add(material, 'alphaTest', 0, 1, 0.01)
    .onChange(() => updateMaterial())
materialFolder.add(material, 'visible')
materialFolder
    .add(material, 'side', options.side)
    .onChange(() => updateMaterial())
materialFolder.open()

const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
}

const meshStandardMaterialFolder = gui.addFolder('THREE.MeshStandardMaterial')

meshStandardMaterialFolder.addColor(data, 'color').onChange(() => {
    material.color.setHex(Number(data.color.toString().replace('#', '0x')))
})
meshStandardMaterialFolder.addColor(data, 'emissive').onChange(() => {
    material.emissive.setHex(
        Number(data.emissive.toString().replace('#', '0x'))
    )
})
meshStandardMaterialFolder.add(material, 'wireframe')
meshStandardMaterialFolder
    .add(material, 'flatShading')
    .onChange(() => updateMaterial())
meshStandardMaterialFolder.add(material, 'roughness', 0, 1)
meshStandardMaterialFolder.add(material, 'metalness', 0, 1)
meshStandardMaterialFolder.open()

function updateMaterial() {
    material.side = Number(material.side) as THREE.Side
    material.needsUpdate = true
}

function animate() {
    requestAnimationFrame(animate)

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
