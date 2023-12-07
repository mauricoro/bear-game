import * as THREE from 'three'

class Platform {
  constructor(name, x, z) {
    //  Groups body parts for organization and movement
    this.mesh = new THREE.Group()
    this.mesh.name = name
    this.mesh.z = z

    const addPart = (x, y, z, width, height, depth, color) => {
      const partGeometry = new THREE.BoxGeometry(width, height, depth)
      const partColor = new THREE.MeshPhongMaterial({ color: color })
      const part = new THREE.Mesh(partGeometry, partColor)
      part.castShadow = true
      part.position.set(x, y, z)
      this.mesh.add(part)
    }

    //  Color variables
    const plankColor = 0x8c6429
    const leavesColor = 0x087830

    //  Trunk
    addPart(0, 0.5, 0, 0.1, 0.1, 1, plankColor)
    addPart(0.2, 0.5, 0, 0.1, 0.1, 1, plankColor)
    addPart(-0.2, 0.5, 0, 0.1, 0.1, 1, plankColor)
    addPart(0.4, 0.5, 0, 0.1, 0.1, 1, plankColor)
    addPart(-0.4, 0.5, 0, 0.1, 0.1, 1, plankColor)
    this.mesh.position.set(-1 * z, 0, -1 * x)

    // this.mesh.position.set(-3, 0.14, -3)
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
}

export default Platform
