import * as THREE from 'three'
import * as CANNON from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CannonDebugRenderer from './DebugRenderer'
import * as dat from 'dat.gui'
import Stats from 'stats.js'
import DragStrip from './DragStrip'
import CarFactory from './Car'

// Debug
const gui = new dat.GUI()
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Cannon.js World
const world = new CANNON.World()
world.gravity.set(0, 0, -10)
world.broadphase = new CANNON.NaiveBroadphase()
world.solver.iterations = 40

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xd9f4fa)

const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
directionalLight.castShadow = true
directionalLight.position.set(60, -60, 20)
scene.add(directionalLight)

scene.fog = new THREE.Fog(0xbfbfbf, 5, 60)

const dragStrip = new DragStrip(scene, world, 60, 240)

const car1 = CarFactory.createCar('lamborghini', scene, world, dragStrip, {
  mass: 1500,
  engineForce: 6000,
  topSpeed: 8,
  reverseTopSpeed: 1,
  position: new THREE.Vector3(0.5, 0, 0.165),
  rotation: new THREE.Vector3(90, 180, 0),
  scale: 0.2,
})

const car2 = CarFactory.createCar('ferrari', scene, world, dragStrip, {
  mass: 1500,
  engineForce: 6000,
  topSpeed: 8,
  reverseTopSpeed: 1,
  position: new THREE.Vector3(-0.5, 0, 0.035),
  rotation: new THREE.Vector3(90, -90, 0),
  scale: 0.4,
})


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
// camera.position.x = -0.5
camera.position.y = -1
camera.position.z = 1
camera.rotateX(65 * Math.PI / 180)
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
renderer.outputEncoding = THREE.sRGBEncoding

const cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world)

const updatePhysics = () => {
  world.step(1 / 60)

  car1.updateCarPosition(0.015)
  car2.updateCarPosition(-0.12)

  // camera.position.y = car2.carBody.position.y - 1
}

const animate = () => {
  requestAnimationFrame(animate)

  stats.begin()

  // Update Orbital Controls
  controls.update()

  cannonDebugRenderer.update()

  updatePhysics()

  renderer.render(scene, camera)

  stats.end()
}
animate()
