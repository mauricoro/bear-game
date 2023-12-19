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
    // this.matrix = []
    //  Creates 8 x 8 array of 0's
    this.matrix = new Array(8).fill().map(() => new Array(8).fill(0))

    //  Choosing random positions
    let rowShifts = [-1, 0, 1]
    let riverRow = parseInt(Math.floor(Math.random() * 8))
    let riverColumn = 0
    let trees = 0
    let minDistance = 3
    let treeIndex =
      (riverRow +
        minDistance +
        Math.floor(Math.random() * (8 - minDistance - 1))) %
      8

    //  Creating dynamic rivers
    while (riverColumn < 8) {
      this.matrix[riverRow][riverColumn] = 1
      if (riverColumn % 2 == 1) {
        let newRow =
          riverRow + rowShifts[parseInt(Math.round(Math.random() * 2))]
        if (newRow > 7 || newRow < 0) {
          newRow = riverRow
        }
        if (newRow != riverRow) {
          this.matrix[newRow][riverColumn] = 1
        }
        riverRow = newRow
      }
      riverColumn++
    }

    while (trees < 2) {
      const treeRow = parseInt(Math.floor(Math.random() * 8))
      const treeColumn = parseInt(Math.floor(Math.random() * 8))
      if (this.matrix[treeRow][treeColumn] == 0) {
        this.matrix[treeRow][treeColumn] = 2
        trees++
      }
    }

    //  Setting up matrix and meshes
    for (let i = 0; i < 8; i++) {
      // this.matrix[i] = []
      for (let j = 0; j < 8; j++) {
        if (this.matrix[i][j] == 2) {
          let startingTree = new Tree(
            'z' + String(i + position) + 'x' + String(j)
          )
          startingTree.setPosition(-1 * j, 0, -1 * (i + position))
          startingTree.addToScene(scene)
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
