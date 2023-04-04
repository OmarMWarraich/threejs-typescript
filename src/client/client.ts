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

const controls = new OrbitControls(camera, renderer.domElement)
controls.screenSpacePanning = true

// controls.screenSpacePanning = true
// controls.addEventListener('change', render)

/* const boxGeometry = new THREE.BoxGeometry()
const sphereGeometry = new THREE.SphereGeometry()
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
const torusKnotGeometry = new THREE.TorusKnotGeometry() */
const planeGeometry = new THREE.PlaneGeometry(3.6, 1.8, 360, 180)

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

const displacementMap = new THREE.TextureLoader().load('img/materialTextures4/gebco_bathy.5400x2700_8bit.jpg')
material.displacementMap = displacementMap

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

const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    specular: material.specular.getHex(),
}

const meshPhongMaterialFolder = gui.addFolder('THREE.MeshPhongMaterialFolder')

meshPhongMaterialFolder.addColor(data, 'color').onChange(() => {
    material.color.setHex(Number(data.color.toString().replace('#', '0x')))
})

meshPhongMaterialFolder.addColor(data, 'emissive').onChange(() => {
    material.emissive.setHex(
        Number(data.emissive.toString().replace('#', '0x'))
    )
})

meshPhongMaterialFolder.addColor(data, 'specular').onChange(() => {
    material.specular.setHex(
        Number(data.specular.toString().replace('#', '0x'))
    )
})

meshPhongMaterialFolder.add(material, 'shininess', 0, 1024)
meshPhongMaterialFolder.add(material, 'wireframe')

meshPhongMaterialFolder
    .add(material, 'flatShading')
    .onChange(() => updateMaterial())

meshPhongMaterialFolder.add(material, 'reflectivity', 0, 1)
meshPhongMaterialFolder.add(material, 'refractionRatio', 0, 1)
meshPhongMaterialFolder.add(material, 'displacementScale', 0, 1, 0.01)
meshPhongMaterialFolder.add(material, 'displacementBias', -1, 1, 0.01)

function updateMaterial() {
    material.side = Number(material.side) as THREE.Side
    material.needsUpdate = true
}

const planeData = {
    width: 3.6,
    height: 1.8,
    widthSegments: 360,
    heightSegments: 180,
}

const planePropertiesFolder = gui.addFolder('PlaneGeometry')
planePropertiesFolder
       .add(planeData, 'widthSegments', 1, 360)
       .onChange(regeneratePlaneGeometry)
planePropertiesFolder
        .add(planeData, 'heightSegments', 1, 180)
        .onChange(regeneratePlaneGeometry)
planePropertiesFolder.open()

function regeneratePlaneGeometry() {
    const newGeometry = new THREE.PlaneGeometry(
        planeData.width,
        planeData.height,
        planeData.widthSegments,
        planeData.heightSegments
    )
    plane.geometry.dispose()
    plane.geometry = newGeometry
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
