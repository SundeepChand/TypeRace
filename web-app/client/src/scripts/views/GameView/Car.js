import * as THREE from 'three'
import * as CANNON from 'cannon'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { WINDOW_SIZE } from '../../constants'

import Lamborghini from '../../../assets/models/vehicles/lamborghini_gallardo/lamborghini_gallardo.glb'
import Ferrari from '../../../assets/models/vehicles/ferrari_348/ferrari_348.glb'

const carParameters = {
  ferrari: {
    mass: 1500,
    engineForce: 6000,
    topSpeed: 8,
    reverseTopSpeed: 1,
    position: new THREE.Vector3(-0.5, 0, 0.035),
    rotation: new THREE.Vector3(90, -90, 0),
    scale: 0.4,
    zOffset: -0.12,
  },
  lamborghini: {
    mass: 1500,
    engineForce: 6000,
    topSpeed: 8,
    reverseTopSpeed: 1,
    position: new THREE.Vector3(0.5, 0, 0.165),
    rotation: new THREE.Vector3(90, 180, 0),
    scale: 0.22,
    zOffset: 0.015,
  }
}

class Car {
  physicsMaterial = new CANNON.Material('car-wheels')
  cameraOffset = new THREE.Vector3(0, -1, 0.7)
  cameraXAngleInDegrees = 65

  constructor(carName, mass, engineForce, topSpeed, reverseTopSpeed, zOffset) {
    this.name = carName
    this.mass = mass
    this.engineForce = engineForce
    this.topSpeed = topSpeed
    this.reverseTopSpeed = -reverseTopSpeed
    this.zOffset = zOffset
  }

  init = (scene, world, gltfFile, position, rotation, scale) => {
    this.position = position
    this.rotation = rotation
    this.scale = scale

    this.loadModel(scene, gltfFile, position, rotation, scale)
    this.initCamera()
    this.initPhysics(world)
    this.initControls()
  }

  loadModel = (scene, gltfFile, position, rotation, scale) => {

    const loader = new GLTFLoader()
    loader.load(
      gltfFile,
      (gltf) => {
        gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = scale
        gltf.scene.rotateX(rotation.x * Math.PI / 180)
        gltf.scene.rotateY(rotation.y * Math.PI / 180)
        gltf.scene.rotateZ(rotation.z * Math.PI / 180)
        gltf.scene.position.x = position.x
        gltf.scene.position.y = position.y
        gltf.scene.position.z = position.z
        gltf.scene.castShadow = true
        this.gltf = gltf
        scene.add(gltf.scene)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      }
    )
  }

  initCamera = () => {
    this.camera = new THREE.PerspectiveCamera(75, WINDOW_SIZE.width / WINDOW_SIZE.height, 0.1, 100)
    this.camera.position.x = this.position.x + this.cameraOffset.x
    this.camera.position.y = this.position.y + this.cameraOffset.y
    this.camera.position.z = this.position.z + this.cameraOffset.z
    this.camera.rotateX(this.cameraXAngleInDegrees * Math.PI / 180)
    this.camera.name = this.name
  }

  initPhysics = (world) => {
    const shape = new CANNON.Box(new CANNON.Vec3(0.25, 0.54, 0.15))
    this.carBody = new CANNON.Body({ mass: this.mass, material: this.physicsMaterial })
    this.carBody.addShape(shape)
    this.carBody.position.set(this.position.x, this.position.y, this.position.z + 1)
    this.carBody.linearDamping = 0.9
    world.addBody(this.carBody)
  }

  initControls = () => {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp') {
        this.moveForward()
      } else if (event.key === 'ArrowDown') {
        this.moveBackward()
      }
    })
  }

  getPosition = () => {
    return this.carBody.position
  }

  moveForward = () => {
    if (this.carBody.velocity.y < this.topSpeed) {
      this.carBody.velocity.y += (this.engineForce / this.mass)
    }
  }

  moveBackward = () => {
    if (this.carBody.velocity.y > this.reverseTopSpeed) {
      this.carBody.velocity.y -= (this.engineForce / this.mass)
    }
  }

  updateCarPosition = () => {
    this.gltf.scene.position.copy(this.carBody.position)
    this.gltf.scene.position.z += this.zOffset
    this.gltf.scene.position.x = this.position.x
    this.camera.position.y = this.carBody.position.y - 0.9
  }
}

class CarFactory {
  static carCount = 0

  static createCar = (carModel, scene, world, dragStrip, xPosition) => {
    const carName = `car-${this.carCount}`
    const carProperties = carParameters[carModel]
    carProperties.position.x = xPosition
    const car = new Car(carName, carProperties.mass, carProperties.engineForce, carProperties.topSpeed, carProperties.reverseTopSpeed, carProperties.zOffset)

    const carContact = new CANNON.ContactMaterial(dragStrip.surface, car.physicsMaterial, {
      friction: 0.0,
      restitution: 0.3,
      contactEquationStiffness: 1e8,
      contactEquationRelaxation: 3,
    })
    world.addContactMaterial(carContact)

    switch (carModel) {
      case 'ferrari':
        car.init(scene, world, Ferrari, carProperties.position, carProperties.rotation, carProperties.scale)
        break
      case 'lamborghini':
        car.init(scene, world, Lamborghini, carProperties.position, carProperties.rotation, carProperties.scale)
        break
      default:
        car.init(scene, world, Ferrari, carProperties.position, carProperties.rotation, carProperties.scale)
    }
    this.carCount++

    return car;
  }
}

export default CarFactory
