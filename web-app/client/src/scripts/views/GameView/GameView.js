import * as THREE from 'three'
import * as CANNON from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'
import DragStrip from './DragStrip'
import CarFactory from './Car'
import { WINDOW_SIZE } from '../../constants'

const GameState = Object.freeze({
  RUNNING: 0,
  GAME_OVER: 1
})

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

    // Player and other cars
    this.player = null
    this.other = null

    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xd9f4fa)

    this.initLighting()
    this.initDragRaceArena()
    this.initCamera()
    this.initRenderer()

    this.curGameState = GameState.RUNNING

    window.addEventListener('resize', this.handleWindowResize)
  }

  initLighting = () => {
    const light = new THREE.AmbientLight(0xffffff, 0.5) // soft white light
    this.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
    directionalLight.castShadow = true
    directionalLight.position.set(60, -60, 20)
    this.scene.add(directionalLight)

    this.scene.fog = new THREE.Fog(0xbfbfbf, 0, 50)
  }

  initDragRaceArena = () => {
    this.dragStrip = new DragStrip(this.scene, this.world, 60, 240)
  }

  createPlayerCar = (carName, xPosition = 0.5) => {
    this.player = this.player = CarFactory.createCar(carName, this.scene, this.world, this.dragStrip, xPosition)
    this.camera = this.player.camera
  }

  hasPlayerReachedFinishLine = () => {
    return (this.player?.carBody.position.y >= this.dragStrip.finishLinePositionY) ?? false
  }

  createOpponentCar = (carName, xPosition = -0.5) => {
    this.other = CarFactory.createCar(carName, this.scene, this.world, this.dragStrip, xPosition)
  }

  addPlayerReachedFinishLineCallback = (callback) => {
    this.handlePlayerReachedFinishLine = callback
  }

  updatePhysics = () => {
    this.world.step(1 / 60)

    if (this.player !== null && this.other !== null) {
      this.player.updateCarPosition()
      this.other.updateCarPosition()
    }

    if (this.curGameState === GameState.RUNNING && this.hasPlayerReachedFinishLine()) {
      this.handlePlayerReachedFinishLine()
      this.curGameState = GameState.GAME_OVER
    }
  }

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(75, WINDOW_SIZE.width / WINDOW_SIZE.height, 0.1, 100)
    this.camera.position.y = 195
    this.camera.position.z = 18
    this.scene.add(this.camera)

    // Controls
    // this.controls = new OrbitControls(this.camera, this.canvas)
    // this.controls.enableDamping = true
  }

  handleWindowResize = () => {
    // Update sizes
    WINDOW_SIZE.width = window.innerWidth
    WINDOW_SIZE.height = window.innerHeight

    // Update camera
    this.camera.aspect = WINDOW_SIZE.width / WINDOW_SIZE.height
    this.camera.updateProjectionMatrix()

    // Update renderer
    this.renderer.setSize(WINDOW_SIZE.width, WINDOW_SIZE.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  initRenderer = () => {
    /**
     * Renderer
     */
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    })
    this.renderer.setSize(WINDOW_SIZE.width, WINDOW_SIZE.height)
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
