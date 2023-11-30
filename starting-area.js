import * as THREE from 'three'
import Tree from './tree.js'

//  Don't forget to return the grey borders on the map
class StartingArea {
  constructor(scene, position = -8) {
    //  Groups body parts for organization and movement
    this.mesh = new THREE.Group()
    this.materials = [
      new THREE.MeshPhongMaterial({ color: 0x8dc24d }),
      new THREE.MeshPhongMaterial({ color: 0x5c71fa }),
      new THREE.MeshPhongMaterial({ color: 0x8f6f3d }),
    ]
    this.heights = [0, -0.2, 0]
    //Produces values from 0 - 2
    this.matrix = []

    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
    let riverIndex = parseInt(Math.floor(Math.random() * 8))
    let minDistance = 3
    let treeIndex =
      (riverIndex +
        minDistance +
        Math.floor(Math.random() * (8 - minDistance - 1))) %
      8
    for (let i = 0; i < 8; i++) {
      this.matrix[i] = []
      for (let j = 0; j < 8; j++) {
        if (i == 3 && j == 5) {
          this.matrix[i][j] = 2
          let startingTree = new Tree(i)
          startingTree.setPosition(-5, 0, -3)
          startingTree.addToScene(scene)
        } else {
          this.matrix[i][j] = 0
        }
        // this.matrix[i][j] = parseInt(Math.floor(Math.random() * 3))

        let block = new THREE.Mesh(geometry, this.materials[this.matrix[i][j]])
        block.receiveShadow = true
        block.position.set(-1 * j, this.heights[this.matrix[i][j]], -1 * i)
        this.mesh.add(block)
      }
    }
    // cube.position.set(1, 1, 1)
    // this.mesh.add(cube)

    //  Color variables
    const bearColor = 0xc19c61
    const darkColor = 0x331800
    const lightColor = 0xceb396
    const mediumColor = 0x8f6f3d
  }

  addToScene(scene) {
    this.mesh.position.set(0, 0, 0)
    scene.add(this.mesh)
  }

  getMatrix() {
    return this.matrix
  }
}

export default StartingArea

/*    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 8; j++) {
        let block = new THREE.Mesh(geometry, color)
        block.receiveShadow = true
        block.position.set(-1 * i, 0, -1 * j)
        this.mesh.add(block)
      }
    }*/
