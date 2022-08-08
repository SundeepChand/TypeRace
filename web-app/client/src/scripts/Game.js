import * as THREE from 'three'
import * as CANNON from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'
import DragStrip from './DragStrip'
import CarFactory from './Car'

class GameView {
  constructor() {
    // Debug
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    this.canvas = document.querySelector('canvas.webgl')

    // Cannon.js World
    this.world = new CANNON.World()
    this.world.gravity.set(0, 0, -10)
    this.world.broadphase = new CANNON.NaiveBroadphase()
    this.world.solver.iterations = 40

    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xd9f4fa)

    this.initLighting()
    this.initDragRaceArena()
    this.initRendererAndCamera()
  }

  initLighting() {
    const light = new THREE.AmbientLight(0xffffff, 0.5) // soft white light
    this.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight.castShadow = true
    directionalLight.position.set(60, -60, 20)
    this.scene.add(directionalLight)

    this.scene.fog = new THREE.Fog(0xbfbfbf, 0, 50)
  }

  initDragRaceArena() {
    const dragStrip = new DragStrip(this.scene, this.world, 60, 240)

    this.car1 = CarFactory.createCar('lamborghini', this.scene, this.world, dragStrip, {
      mass: 1500,
      engineForce: 6000,
      topSpeed: 8,
      reverseTopSpeed: 1,
      position: new THREE.Vector3(0.5, 0, 0.165),
      rotation: new THREE.Vector3(90, 180, 0),
      scale: 0.2,
    })

    this.car2 = CarFactory.createCar('ferrari', this.scene, this.world, dragStrip, {
      mass: 1500,
      engineForce: 6000,
      topSpeed: 8,
      reverseTopSpeed: 1,
      position: new THREE.Vector3(-0.5, 0, 0.035),
      rotation: new THREE.Vector3(90, -90, 0),
      scale: 0.4,
    })
  }

  updatePhysics() {
    this.world.step(1 / 60)

    this.car1.updateCarPosition(0.015)
    this.car2.updateCarPosition(-0.12)

    this.camera.position.y = this.car2.carBody.position.y - 0.9
  }

  initRendererAndCamera() {
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

    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    this.camera.position.x = -0.5
    this.camera.position.y = -0.9
    this.camera.position.z = 0.7
    this.camera.rotateX(65 * Math.PI / 180)
    this.scene.add(this.camera)
    // Controls
    // this.controls = new OrbitControls(this.camera, this.canvas)
    // this.controls.enableDamping = true

    /**
     * Renderer
     */
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    })
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputEncoding = THREE.sRGBEncoding
  }

  run = () => {
    requestAnimationFrame(this.run)

    this.stats.begin()

    // Update Orbital Controls
    // this.controls.update()

    this.updatePhysics()

    this.renderer.render(this.scene, this.camera)

    this.stats.end()
  }
}

export default GameView
