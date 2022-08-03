import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'dat.gui'
import Lamborghini from '../assets/models/vehicles/lamborghini_gallardo/lamborghini_gallardo.glb'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x8fd8ff)

const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.castShadow = true
directionalLight.position.set(60, -60, 20)
scene.add(directionalLight)

const groundGeometry = new THREE.PlaneGeometry(60, 60)
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x33ff4e, side: THREE.FrontSide })
groundMaterial.roughness = 1
groundMaterial.metalness = 0
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
scene.add(ground)

const roadGeometry = new THREE.BoxGeometry(2, 60, 0.05)
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, side: THREE.FrontSide })
const road = new THREE.Mesh(roadGeometry, roadMaterial)
scene.add(road)

const loader = new GLTFLoader()
loader.load(
  Lamborghini,
  (gltf) => {
    gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = 0.2
    gltf.scene.rotateX(90 * Math.PI / 180)
    gltf.scene.rotateY(180 * Math.PI / 180)
    gltf.scene.position.z = 1
    gltf.scene.position.y = 0.8
    // directionalLight.target = gltf.scene
    scene.add(gltf.scene)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  }
)

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
camera.rotateX(50 * Math.PI / 180)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;

const animate = () => {
  requestAnimationFrame(animate)

  // Update Orbital Controls
  controls.update()

  renderer.render(scene, camera)
}
animate()
