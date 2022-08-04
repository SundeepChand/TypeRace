import * as THREE from 'three'
import * as CANNON from 'cannon'

class Ground {
  constructor(width, height) {
    const groundGeometry = new THREE.PlaneGeometry(width, height)
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x33ff4e, side: THREE.FrontSide })
    groundMaterial.roughness = 1
    groundMaterial.metalness = 0

    this.mesh = new THREE.Mesh(groundGeometry, groundMaterial)
  }
}

class Road {
  constructor(width, height) {
    const roadGeometry = new THREE.BoxGeometry(width, height, 0.05)
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, side: THREE.FrontSide })
    this.mesh = new THREE.Mesh(roadGeometry, roadMaterial)

    const roadShape = new CANNON.Plane()
    this.physicsMaterial = new CANNON.Material('road')
    const roadBody = new CANNON.Body({ mass: 0, shape: roadShape, material: this.physicsMaterial })
    this.body = roadBody
  }
}

class DragStrip {
  constructor(scene, world, width, height) {
    const ground = new Ground(width, height)
    const road = new Road(2, 240)

    this.surface = road.physicsMaterial

    scene.add(ground.mesh)
    scene.add(road.mesh)
    world.add(road.body)
  }
}

export default DragStrip
