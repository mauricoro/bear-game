import * as THREE from 'three'
class Tree {
  constructor(name) {
    //  Groups body parts for organization and movement
    this.mesh = new THREE.Group()
    this.mesh.name = name
    const groupNames = ['trunk', 'leaves']
    this.groups = {}

    groupNames.forEach((name) => {
      this.groups[name] = new THREE.Group()
      this.mesh.add(this.groups[name])
    })

    const addPart = (x, y, z, width, height, depth, color, group) => {
      const partGeometry = new THREE.BoxGeometry(width, height, depth)
      const partColor = new THREE.MeshPhongMaterial({ color: color })
      const part = new THREE.Mesh(partGeometry, partColor)
      part.castShadow = true
      part.position.set(x, y, z)
      this.groups[group].add(part)
    }

    //  Color variables
    const darkColor = 0x432616
    const leavesColor = 0x087830

    //  Trunk
    addPart(0, 1.5, 0, 0.7, 2, 0.7, darkColor, 'trunk')

    //  Leaves
    addPart(0, 3.2, 0, 1.5, 1.3, 1.5, leavesColor, 'leaves')

    // this.mesh.position.set(-3, 0.14, -3)
    // scene.add(this.mesh)
  }

  //  Additional helper methods
  addToScene(scene) {
    scene.add(this.mesh)
  }

  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z)
  }

  setRotation(rot) {
    this.rot = rot
  }
  getMesh() {
    return this.mesh
  }

  getRotation() {
    return this.rot
  }

  getZ() {
    return this.z
  }
}

export default Tree
