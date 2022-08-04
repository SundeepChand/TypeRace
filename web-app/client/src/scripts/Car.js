import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as CANNON from 'cannon'


class Car {
  constructor(mass, engineForce, topSpeed, reverseTopSpeed) {
    this.mass = mass
    this.engineForce = engineForce
    this.topSpeed = topSpeed
    this.reverseTopSpeed = -reverseTopSpeed
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
    this.physicsMaterial = new CANNON.Material('car-wheels')
    this.carBody = new CANNON.Body({ mass: this.mass, material: this.physicsMaterial })
    this.carBody.addShape(shape)
    console.log(this.position)
    this.carBody.position.set(this.position.x, this.position.y, this.position.z + 1)
    this.carBody.linearDamping = 0.9
    world.addBody(this.carBody)
  }

  initControls(world) {
    window.addEventListener('keydown', (event) => {
      console.log(event.key)
      if (event.key === 'ArrowUp') {
        this.moveForward()
      } else if (event.key === 'ArrowDown') {
        this.moveBackward()
      }
      console.log(this.carBody.velocity)
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

  updateCarPosition() {
    this.gltf.scene.position.copy(this.carBody.position)
    this.gltf.scene.position.z -= 0.1
  }
}

export default Car
