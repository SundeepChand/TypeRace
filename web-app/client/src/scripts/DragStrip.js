import * as THREE from 'three'
import * as CANNON from 'cannon'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import Tree from '../assets/models/trees/tree-0.glb'
import FinishLineTexture from '../assets/textures/finish_line.png'

class TreeModel {
  constructor(scene, transforms) {
    const loader = new GLTFLoader()

    loader.load(Tree, (gltf) => {
      gltf.scene.scale.x = gltf.scene.scale.y = gltf.scene.scale.z = transforms.scale
      gltf.scene.rotateX(transforms.rotation.x * Math.PI / 180)
      gltf.scene.rotateY(transforms.rotation.y * Math.PI / 180)
      gltf.scene.rotateZ(transforms.rotation.z * Math.PI / 180)

      gltf.scene.position.x = transforms.position.x
      gltf.scene.position.y = transforms.position.y
      gltf.scene.position.z = transforms.position.z

      gltf.scene.castShadow = true

      scene.add(gltf.scene)
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    })
  }
}

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

class FinishLine {
  constructor(width, height, positionY) {
    const geometry = new THREE.BoxGeometry(width - 0.05, height, 0.01)
    geometry.translate(0, positionY, 0.023)
    const texture = new THREE.TextureLoader().load(FinishLineTexture)
    const finishLineMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide })
    this.mesh = new THREE.Mesh(geometry, finishLineMaterial)
  }
}

class DragStrip {
  roadWidth = 2
  finishLinePositionY = 200

  constructor(scene, world, width, height) {
    const ground = new Ground(width, height)
    ground.mesh.translateY(height / 2 - 5)

    const road = new Road(this.roadWidth, height)
    road.mesh.translateY(height / 2 - 5)

    this.surface = road.physicsMaterial

    scene.add(ground.mesh)
    scene.add(road.mesh)
    world.add(road.body)

    const finishLine = new FinishLine(this.roadWidth, 1, this.finishLinePositionY)
    scene.add(finishLine.mesh)

    for (let i = 0; i < 40; i++) {
      const treeTransforms = {
        position: {
          x: Math.random() * 10 * this.roadWidth + this.roadWidth,
          y: Math.random() * height,
          z: 0
        },
        rotation: {
          x: 90,
          y: 0,
          z: 0
        },
        scale: Math.random() * 0.15 + 0.2
      }
      if (Math.random() < 0.5)
        treeTransforms.position.x *= -1

      new TreeModel(scene, treeTransforms)
    }
  }
}

export default DragStrip
