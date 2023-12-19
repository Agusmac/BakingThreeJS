import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

const bakedTexture = textureLoader.load("baked.jpg")
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

const bakedTexture2 = textureLoader.load("BakedRoom.jpg")
bakedTexture2.flipY = false
bakedTexture2.colorSpace = THREE.SRGBColorSpace


// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// MATERIALS
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const portalMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

// MODEL
gltfLoader.load(
    'portalMerged.glb',
    (gltf) => {

        // MERGED MODEL (this is the merged scene + the 3 lights,4 children in total)
        gltf.scene.position.x = 25
        gltf.scene.scale.set(5.0, 5.0, 5.0)
        gltf.scene.children[1].material = portalMaterial
        gltf.scene.children[0].material = poleLightMaterial
        gltf.scene.children[2].material = poleLightMaterial
        gltf.scene.children[3].material = bakedMaterial

        // NORMAL MODEL (DEFAULT, ALLOWS YOU TO ACCESS EVERY CHILDREN)
        // gltf.scene.traverse((child) => {
        //     child.material = bakedMaterial
        // })
        // portal
        // gltf.scene.children[68].material = portalMaterial
        // // poleLights
        // gltf.scene.children[67].material = poleLightMaterial
        // gltf.scene.children[69].material = poleLightMaterial


        scene.add(gltf.scene)
        console.log(gltf.scene)
        // gltf.scene.children[68]
    }
)



const bakedMaterial2 = new THREE.MeshBasicMaterial({
    // color:"red",
    map: bakedTexture2
})
// MODEL 2
gltfLoader.load(
    'RoomTutorial.glb',
    (gltf) => {

        gltf.scene.traverse((child) => { child.material = bakedMaterial2 })

        gltf.scene.children[5].material.side = THREE.DoubleSide
        scene.add(gltf.scene)
        console.log(gltf.scene.children)

    }
)











/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

// const light = new THREE.AmbientLight( 0x404040,50 ); // soft white light
// scene.add( light );
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()