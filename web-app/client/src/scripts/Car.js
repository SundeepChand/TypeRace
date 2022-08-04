import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as CANNON from 'cannon'


class Car {
  constructor() {
    this.loader = new GLTFLoader()
  }

  loadModel(scene, gltfFile, position, rotation, scale) {
    this.position = position
    this.rotation = rotation
    this.scale = scale

    this.loader.load(
      gltfFile,
      (gltf) => {
        gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = scale
        gltf.scene.rotateX(rotation.x * Math.PI / 180)
        gltf.scene.rotateY(rotation.y * Math.PI / 180)
        gltf.scene.rotateZ(rotation.z * Math.PI / 180)
        gltf.scene.position.x = position.x
        gltf.scene.position.y = position.y
        gltf.scene.position.z = position.z
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
    const carBody = new CANNON.Body({ mass: 1 })
    carBody.addShape(shape)
    console.log(this.position)
    carBody.position.set(this.position.x, this.position.y, this.position.z)
    world.addBody(carBody)
  }
}

export default Car
