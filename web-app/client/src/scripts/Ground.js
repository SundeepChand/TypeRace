import * as THREE from 'three'
import * as CANNON from 'cannon'

class Ground {
  constructor(width, height) {
    const groundGeometry = new THREE.PlaneGeometry(width, height)
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x33ff4e, side: THREE.FrontSide })
    groundMaterial.roughness = 1
    groundMaterial.metalness = 0

    this.mesh = new THREE.Mesh(groundGeometry, groundMaterial)

    const groundShape = new CANNON.Plane()
    this.physicsMaterial = new CANNON.Material('ground')
    const groundBody = new CANNON.Body({ mass: 0, shape: groundShape, material: this.physicsMaterial })
    this.body = groundBody
  }
}

export default Ground
