/* Description

    Raycasting allows you to create a vector from a 3D point in the scene, and detect which object(s) the vector intersects.

    The raycasting class is almost always used for mouse picking objects in the 3D scene.

    We can set up the raycaster position and direction using the set or setFromCamera methods and then call its intersectObject or intersectObjects methods to tell us many things about the scene objects that were intersected by the ray, including,

        the distance of the intersection from the Raycaster position,
        the position of the intersection in the 3D scene,
        the face of the object that was intersected,
        the direction of the faces normal,
        the UV coordinate of the intersection on the face
        and a reference to the intersected object itself.
 */

        import * as THREE from 'three'
        import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
        import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
        import Stats from 'three/examples/jsm/libs/stats.module'
        
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
        
        // const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
        // const points = new Array()
        // points.push( new THREE.Vector3( 0, 0, 0 ) )
        // points.push( new THREE.Vector3( 0, 0, .25 ) )
        // const geometry = new THREE.BufferGeometry().setFromPoints( points )
        // const line = new THREE.Line( geometry, material )
        // scene.add( line )
        
        const arrowHelper = new THREE.ArrowHelper(
            new THREE.Vector3(),
            new THREE.Vector3(),
            0.25,
            0xffff00
        )
        scene.add(arrowHelper)
        
        const material = new THREE.MeshNormalMaterial()
        
        const boxGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        const coneGeometry = new THREE.ConeGeometry(0.05, 0.2, 8)
        
        const raycaster = new THREE.Raycaster()
        const sceneMeshes: THREE.Object3D[] = []
        
        const loader = new GLTFLoader()
        loader.load(
            'models/model5/monkey_textured.glb',
            function (gltf) {
                gltf.scene.traverse(function (child) {
                    if ((child as THREE.Mesh).isMesh) {
                        const m = child as THREE.Mesh
                        m.receiveShadow = true
                        m.castShadow = true
                        ;(m.material as THREE.MeshStandardMaterial).flatShading = true
                        sceneMeshes.push(m)
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
                // sceneMeshes.push(gltf.scene)
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
        
        renderer.domElement.addEventListener('dblclick', onDoubleClick, false)
        renderer.domElement.addEventListener('mousemove', onMouseMove, false)
        
        const mouse = new THREE.Vector2()
        
        function onMouseMove(event: MouseEvent) {
            mouse.set(
                (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
                -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
            )
        
            // console.log(mouse)
        
            raycaster.setFromCamera(mouse, camera)
        
            const intersects = raycaster.intersectObjects(sceneMeshes, false)
        
            if (intersects.length > 0) {
                // console.log(sceneMeshes.length + " " + intersects.length)
                // console.log(intersects[0])
                // console.log(intersects[0].object.userData.name + " " + intersects[0].distance + " ")
                // console.log((intersects[0].face as THREE.Face).normal)
                // line.position.set(0, 0, 0)
                // line.lookAt((intersects[0].face as THREE.Face).normal)
                // line.position.copy(intersects[0].point)
        
                const n = new THREE.Vector3()
                n.copy((intersects[0].face as THREE.Face).normal)
                n.transformDirection(intersects[0].object.matrixWorld)
        
                arrowHelper.setDirection(n)
                arrowHelper.position.copy(intersects[0].point)
            }
        }
        
        function onDoubleClick(event: MouseEvent) {
            mouse.set(
                (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
                -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
            )
            raycaster.setFromCamera(mouse, camera)
        
            const intersects = raycaster.intersectObjects(sceneMeshes, false)
        
            if (intersects.length > 0) {
                const n = new THREE.Vector3()
                n.copy((intersects[0].face as THREE.Face).normal)
                n.transformDirection(intersects[0].object.matrixWorld)
        
                // const cube = new THREE.Mesh(boxGeometry, material)
                const cube = new THREE.Mesh(coneGeometry, material)
        
                cube.lookAt(n)
                cube.rotateX(Math.PI / 2)
                cube.position.copy(intersects[0].point)
                cube.position.addScaledVector(n, 0.1)
        
                scene.add(cube)
                sceneMeshes.push(cube)
            }
        }
        
        const stats = new Stats()
        document.body.appendChild(stats.dom)
        
        function animate() {
            requestAnimationFrame(animate)
        
            controls.update()
        
            // if (sceneMeshes.length > 1) {
            //     sceneMeshes[1].rotation.x += .002
            // }
        
            render()
        
            stats.update()
        }
        
        function render() {
            renderer.render(scene, camera)
        }
        
        animate()
        