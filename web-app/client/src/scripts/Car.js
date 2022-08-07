import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as CANNON from 'cannon'

import Lamborghini from '../assets/models/vehicles/lamborghini_gallardo/lamborghini_gallardo.glb'
import Ferrari from '../assets/models/vehicles/ferrari_348/ferrari_348.glb'

class Car {
  physicsMaterial = new CANNON.Material('car-wheels')

  constructor(mass, engineForce, topSpeed, reverseTopSpeed) {
    this.mass = mass
    this.engineForce = engineForce
    this.topSpeed = topSpeed
    this.reverseTopSpeed = -reverseTopSpeed
  }

  init(scene, world, gltfFile, position, rotation, scale) {
    this.loadModel(scene, gltfFile, position, rotation, scale)
    this.initPhysics(world)
    this.initControls()
  }

  loadModel(scene, gltfFile, position, rotation, scale) {
    this.position = position
    this.rotation = rotation
    this.scale = scale

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
        console.log(gltf.scene.scale)
        scene.add(gltf.scene)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      }
    )
  }

  initPhysics(world) {
    const shape = new CANNON.Box(new CANNON.Vec3(0.25, 0.54, 0.15))
    this.carBody = new CANNON.Body({ mass: this.mass, material: this.physicsMaterial })
    this.carBody.addShape(shape)
    console.log(this.position)
    this.carBody.position.set(this.position.x, this.position.y, this.position.z + 1)
    this.carBody.linearDamping = 0.9
    world.addBody(this.carBody)
  }

  initControls() {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp') {
        this.moveForward()
      } else if (event.key === 'ArrowDown') {
        this.moveBackward()
      }
    })
  }

  moveForward() {
    if (this.carBody.velocity.y < this.topSpeed) {
      this.carBody.velocity.y += (this.engineForce / this.mass)
    }
  }

  moveBackward() {
    if (this.carBody.velocity.y > this.reverseTopSpeed) {
      this.carBody.velocity.y -= (this.engineForce / this.mass)
    }
  }

  updateCarPosition(zOffset = 0.0) {
    this.gltf.scene.position.copy(this.carBody.position)
    this.gltf.scene.position.z += zOffset
  }
}

class CarFactory {
  static createCar(carModel, scene, world, dragStrip, carProperties) {
    const car = new Car(carProperties.mass, carProperties.engineForce, carProperties.topSpeed, carProperties.reverseTopSpeed)

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

    return car;
  }
}

export default CarFactory
