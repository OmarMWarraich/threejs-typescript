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
camera.position.z = 1

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// controls.screenSpacePanning = true
// controls.addEventListener('change', render)

/* const boxGeometry = new THREE.BoxGeometry()
const sphereGeometry = new THREE.SphereGeometry()
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
const torusKnotGeometry = new THREE.TorusKnotGeometry() */
const planeGeometry = new THREE.PlaneGeometry(3.6, 1.8)

interface MeshPhongMaterialWithIndex extends THREE.MeshPhongMaterial {
    [key: string]: any;
  }

const material: MeshPhongMaterialWithIndex = new THREE.MeshPhongMaterial()

/* const cube = new THREE.Mesh(boxGeometry, material)
cube.position.x = 5
scene.add(cube)

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.x = 3
scene.add(sphere)

const icosahedron = new THREE.Mesh(icosahedronGeometry, material)
icosahedron.position.x = 0
scene.add(icosahedron)

const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
torusKnot.position.x = -5
scene.add(torusKnot) */

const texture = new THREE.TextureLoader().load('img/materialTextures2/worldColour.5400x2700.jpg')
material.map = texture

// const bumpTexture = new THREE.TextureLoader().load('img/materialTextures3/earth_bumpmap.jpg')
const normalTexture = new THREE.TextureLoader().load('img/materialTextures3/earth_normalmap_8192x4096.jpg')
material.normalMap = normalTexture
material.normalScale.set(2, 2)

/* const envTexture = new THREE.CubeTextureLoader().load([
    'img/materialTextures2/px_eso0932a.jpg',
    'img/materialTextures2/nx_eso0932a.jpg',
    'img/materialTextures2/py_eso0932a.jpg',
    'img/materialTextures2/ny_eso0932a.jpg',
    'img/materialTextures2/pz_eso0932a.jpg',
    'img/materialTextures2/nz_eso0932a.jpg',
])

envTexture.mapping = THREE.CubeReflectionMapping
material.envMap = envTexture */

// const specularTexture = new THREE.TextureLoader().load('img/materialTextures2/grayscale-test.jpg')
/* const specularTexture = new THREE.TextureLoader().load('img/materialTextures2/earthSpecular.jpg')
material.roughnessMap = specularTexture
material.metalnessMap = specularTexture */

const plane: THREE.Mesh = new THREE.Mesh(planeGeometry, material)
scene.add(plane)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

/* const options = {
    side: {
        FrontSide: THREE.FrontSide,
        BackSide: THREE.BackSide,
        DoubleSide: THREE.DoubleSide,
    },
} */

const gui = new GUI()

gui.add(material.normalScale, 'x', 0, 10, 0.01)
gui.add(material.normalScale, 'y', 0, 10, 0.01)
gui.add(light.position, 'x', -20, 20).name('Light Pos X')

// gui.add(material, 'bumpScale', 0, 1, 0.01)

/* const materialFolder = gui.addFolder('THREE.Material')
materialFolder.add(material, 'transparent')
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

const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
}

const meshPhysicalMaterialFolder = gui.addFolder('THREE.MeshPhysicalMaterialFolder')

meshPhysicalMaterialFolder.addColor(data, 'color').onChange(() => {
    material.color.setHex(Number(data.color.toString().replace('#', '0x')))
})

meshPhysicalMaterialFolder.addColor(data, 'emissive').onChange(() => {
    material.emissive.setHex(
        Number(data.emissive.toString().replace('#', '0x'))
    )
})

// meshPhysicalMaterialFolder.add(material, 'shininess', 0, 1024)
meshPhysicalMaterialFolder.add(material, 'wireframe')
meshPhysicalMaterialFolder
    .add(material, 'flatShading')
    .onChange(() => updateMaterial())

meshPhysicalMaterialFolder.add(material, 'reflectivity', 0, 1)
meshPhysicalMaterialFolder.add(material, 'envMapIntensity', 0, 1)
meshPhysicalMaterialFolder.add(material, 'roughness', 0, 1)
meshPhysicalMaterialFolder.add(material, 'metalness', 0, 1)
meshPhysicalMaterialFolder.add(material, 'clearcoat', 0, 1)
meshPhysicalMaterialFolder.add(material, 'clearcoatRoughness', 0, 1)

meshPhysicalMaterialFolder.open()

function updateMaterial() {
    material.side = Number(material.side) as THREE.Side
    material.needsUpdate = true
} */

function animate() {
    requestAnimationFrame(animate)

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
