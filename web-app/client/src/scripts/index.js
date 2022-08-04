import * as THREE from 'three'
import * as CANNON from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CannonDebugRenderer from './DebugRenderer'
import * as dat from 'dat.gui'
import Stats from 'stats.js'
import Ground from './Ground'
import Car from './Car'
import Lamborghini from '../assets/models/vehicles/lamborghini_gallardo/lamborghini_gallardo.glb'
import Ferrari from '../assets/models/vehicles/ferrari_348/ferrari_348.glb'

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

const ground = new Ground(60, 240)
scene.add(ground.mesh)
world.addBody(ground.body)

const roadGeometry = new THREE.BoxGeometry(2, 240, 0.05)
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, side: THREE.FrontSide })
const road = new THREE.Mesh(roadGeometry, roadMaterial)
scene.add(road)

const car1 = new Car()
car1.loadModel(scene, Lamborghini, new THREE.Vector3(0.5, 0, 0.165), new THREE.Vector3(90, 180, 0), 0.2)
car1.initPhysics(world)

const car2 = new Car(1500, 6000, 8, 1)
car2.loadModel(scene, Ferrari, new THREE.Vector3(-0.5, 0, 0.035), new THREE.Vector3(90, -90, 0), 0.4)
car2.initPhysics(world)
car2.initControls(world)

const carContact = new CANNON.ContactMaterial(ground.physicsMaterial, car2.physicsMaterial, {
  friction: 0.0,
  restitution: 0.3,
  contactEquationStiffness: 1e8,
  contactEquationRelaxation: 3,
})
world.addContactMaterial(carContact)


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

  car2.updateCarPosition()

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
