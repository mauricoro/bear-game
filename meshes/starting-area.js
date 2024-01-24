import * as THREE from 'three'
import Tree from './tree.js'

//  Don't forget to return the grey borders on the map
class StartingArea {
  constructor(scene, geometries, materials) {
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

    this.matrix = []

    for (let i = 0; i < 8; i++) {
      this.matrix[i] = []
      for (let j = 0; j < 8; j++) {
        if (i == 5 && j == 5) {
          //  Creates the first tree next to the player
          this.matrix[i][j] = 2
          let startingTree = new Tree(
            'z' + String(i) + 'x' + String(j),
            scene,
            i,
            j,
            geometries,
            materials
          )
          startingTree.setPosition(-j, 0, -i)
          startingTree.addToScene(scene)
        } else {
          this.matrix[i][j] = 0
        }

        //  Create and add block mesh to object's mesh
        let matrixValue = this.matrix[i][j]
        let block = new THREE.Mesh(
          this.geometries[matrixValue],
          this.materials[matrixValue]
        )
        block.receiveShadow = true
        block.position.set(-1 * j, 0, -1 * i)
        this.mesh.add(block)
      }
    }
    scene.add(this.mesh)
  }

  getMatrix() {
    return this.matrix
  }
}

export default StartingArea
