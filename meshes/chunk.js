import * as THREE from 'three'
import Tree from './tree.js'

class Chunk {
  constructor(scene, position = 8, geometries, materials) {
    //  Groups body parts for organization and movement
    this.mesh = new THREE.Group()
    this.materials = [
      materials.get('grass'),
      materials.get('water'),
      materials.get('dirt'),
    ]
    this.geometries = [
      geometries.get('block'),
      geometries.get('water'),
      geometries.get('block'),
    ]
    this.heights = [0, -0.1, 0]
    this.matrix = []

    //  Choosing random positions
    let riverIndex = parseInt(Math.floor(Math.random() * 8))
    let minDistance = 3
    let treeIndex =
      (riverIndex +
        minDistance +
        Math.floor(Math.random() * (8 - minDistance - 1))) %
      8

    //  Setting up matrix and meshes
    for (let i = 0; i < 8; i++) {
      this.matrix[i] = []
      for (let j = 0; j < 8; j++) {
        if (i == riverIndex) {
          this.matrix[i][j] = 1
        } else if (i == treeIndex && j == treeIndex) {
          this.matrix[i][j] = 2
          let startingTree = new Tree(
            'z' + String(i + position) + 'x' + String(j)
          )
          startingTree.setPosition(-1 * j, 0, -1 * (i + position))
          startingTree.addToScene(scene)
        } else {
          this.matrix[i][j] = 0
        }

        let matrixValue = this.matrix[i][j]
        let block = new THREE.Mesh(
          this.geometries[matrixValue],
          this.materials[matrixValue]
        )
        block.receiveShadow = true
        block.position.set(-1 * j, this.heights[this.matrix[i][j]], -1 * i)
        this.mesh.add(block)
      }
    }
    this.mesh.position.set(0, 0, position * -1)
    scene.add(this.mesh)
  }

  getMatrix() {
    return this.matrix
  }
}

export default Chunk
