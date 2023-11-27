import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

//  OVERVIEW
//  This is a class which represents the player character within a video game and allows for it to be animated as it moves around.
//  Because this utilizes 3js and tweenjs there are many reference to meshes and tweens.
//  Meshes refer to the polygons that make up the character and tweens are a way to smoothly transition the positions of a mesh allowing for animation.
//  The main purpose of this class is to organize the parts of the Bear, create meshes for them, and track their positions.
//  The class also creates the tweens needed to animate each part of the Bear.
//  Additionally since this game allows the user to control the Bear in a 2d plane, movement methods exist to control both the position and tweens of the Bear.

class Bear {
  constructor() {
    //  Groups body parts for organization and movement
    this.mesh = new THREE.Group()
    const bodyGroupNames = [
      'head',
      'body',
      'leftArm',
      'rightArm',
      'leftLeg',
      'rightLeg',
    ]
    this.bodyGroups = {}
    this.bodyTweens = {}

    //  Adding meshes and default tweens to each body part to control and style individually.
    //  A "start" and "end" tweens are needed for each part to complete an animation loop.
    bodyGroupNames.forEach((name) => {
      this.bodyGroups[name] = new THREE.Group()
      this.mesh.add(this.bodyGroups[name])

      this.bodyTweens[name + 'Start'] = new TWEEN.Tween({
        x: this.bodyGroups[name].position.x,
      })
        .onUpdate((coords) => {
          this.bodyGroups[name].position.x = coords.x
        })
        .easing(TWEEN.Easing.Exponential.Out)

      this.bodyTweens[name + 'End'] = new TWEEN.Tween({
        x: this.bodyGroups[name].position.x,
      })
        .onUpdate((coords) => {
          this.bodyGroups[name].position.x = coords.x
        })
        .easing(TWEEN.Easing.Exponential.Out)
    })

    //  Edit bodyTweens so each has a specific animation depending on the part
    for (const part in this.bodyTweens) {
      if (
        ['leftLegStart', 'rightLegEnd', 'leftArmEnd', 'rightArmStart'].includes(
          part
        )
      ) {
        this.bodyTweens[part].to(
          { x: this.bodyGroups['body'].position.x + 0.15 },
          300
        )
      } else if (
        ['leftLegEnd', 'rightLegStart', 'leftArmStart', 'rightArmEnd'].includes(
          part
        )
      ) {
        this.bodyTweens[part].to(
          { x: this.bodyGroups['body'].position.x - 0.15 },
          300
        )
      }
    }

    //  Allows animations to repeat by chaining the beginning and ends together
    this.bodyTweens['leftLegStart'].chain(this.bodyTweens['leftLegEnd'])
    this.bodyTweens['leftLegEnd'].chain(this.bodyTweens['leftLegStart'])
    this.bodyTweens['rightLegStart'].chain(this.bodyTweens['rightLegEnd'])
    this.bodyTweens['rightLegEnd'].chain(this.bodyTweens['rightLegStart'])
    this.bodyTweens['leftArmStart'].chain(this.bodyTweens['leftArmEnd'])
    this.bodyTweens['leftArmEnd'].chain(this.bodyTweens['leftArmStart'])
    this.bodyTweens['rightArmStart'].chain(this.bodyTweens['rightArmEnd'])
    this.bodyTweens['rightArmEnd'].chain(this.bodyTweens['rightArmStart'])

    //  Creates class tween to control Bear's general position
    this.rot = 0
    this.tween = new TWEEN.Tween({
      x: this.mesh.position.x,
      z: this.mesh.position.z,
    })
      .to(
        {
          x: this.mesh.position.x + 2 * Math.cos(this.rot),
          z: this.mesh.position.z + 2 * Math.sin(this.rot),
        },
        800
      )
      .onUpdate((coords) => {
        this.mesh.position.x = coords.x
        this.mesh.position.z = coords.z
      })
      .easing(TWEEN.Easing.Exponential.Out)

    //  Adds different meshes to each body part
    const addPart = (x, y, z, width, height, depth, color, group) => {
      const partGeometry = new THREE.BoxGeometry(width, height, depth)
      const partColor = new THREE.MeshPhongMaterial({ color: color })
      const part = new THREE.Mesh(partGeometry, partColor)
      part.castShadow = true
      part.position.set(x, y, z)
      this.bodyGroups[group].add(part)
    }

    //  Color variables
    const bearColor = 0xc19c61
    const darkColor = 0x331800
    const lightColor = 0xceb396
    const mediumColor = 0x8f6f3d

    //  Head
    addPart(0, 2.1, 0, 1, 0.8, 0.9, bearColor, 'head')

    //  Nose
    addPart(0.55, 2, 0, 0.1, 0.1, 0.2, darkColor, 'head')

    //  Mouth
    addPart(0.525, 1.91, 0, 0.05, 0.3, 0.4, lightColor, 'head')

    //  Eyes
    addPart(0.5, 2.15, 0.25, 0.05, 0.11, 0.11, darkColor, 'head')
    addPart(0.5, 2.15, -0.25, 0.05, 0.11, 0.11, darkColor, 'head')

    //  Ears
    addPart(0, 2.5, 0.5, 0.2, 0.3, 0.3, bearColor, 'head')
    addPart(0, 2.5, -0.5, 0.2, 0.3, 0.3, bearColor, 'head')

    addPart(0.1, 2.5, 0.5, 0.05, 0.1, 0.1, lightColor, 'head')
    addPart(0.1, 2.5, -0.5, 0.05, 0.1, 0.1, lightColor, 'head')

    //  Body
    addPart(0, 1.4, 0, 0.8, 0.7, 0.8, bearColor, 'body')
    addPart(0.4025, 1.4, 0, 0.05, 0.5, 0.5, lightColor, 'body')

    //  Arms
    addPart(0, 1.3, 0.45, 0.2, 0.5, 0.15, mediumColor, 'leftArm')
    addPart(0, 1.3, -0.45, 0.2, 0.5, 0.15, mediumColor, 'rightArm')

    //  Legs
    addPart(0, 0.9, 0.2, 0.2, 0.7, 0.2, mediumColor, 'leftLeg')
    addPart(0, 0.9, -0.2, 0.2, 0.7, 0.2, mediumColor, 'rightLeg')
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

  //  Movement related methods
  startDash() {
    this.tween = new TWEEN.Tween({
      x: this.mesh.position.x,
      z: this.mesh.position.z,
    })
      .to(
        {
          x: this.mesh.position.x + 3 * Math.cos(this.rot),
          z: this.mesh.position.z + 3 * -1 * Math.sin(this.rot),
        },
        800
      )
      .onUpdate((coords) => {
        this.mesh.position.x = coords.x
        this.mesh.position.z = coords.z
      })
      .easing(TWEEN.Easing.Exponential.Out)
    this.tween.start()
    setTimeout(() => {
      this.endDash()
    }, 300)
  }

  endDash() {
    if (this.tween.isPlaying()) {
      this.tween.stop()
    }
  }

  notDashing() {
    if (this.tween.isPlaying()) {
      return false
    } else {
      return true
    }
  }

  startWalking() {
    //Checks if any bodyTweens are playing and if not allow for bodyTweens to begin
    if (Object.values(this.bodyTweens).every((tween) => !tween.isPlaying())) {
      //  Begin bodyTweens
      this.bodyTweens['leftLegStart'].start()
      this.bodyTweens['rightLegStart'].start()
      this.bodyTweens['leftArmStart'].start()
      this.bodyTweens['rightArmStart'].start()
    }
  }

  stopWalking() {
    for (const value of Object.values(this.bodyTweens)) {
      if (value.isPlaying()) {
        value.stop()
      }
    }

    //  Resets positions of body parts based on Bear's general position
    this.bodyGroups['leftLeg'].position.x = this.bodyGroups['body'].position.x
    this.bodyGroups['rightLeg'].position.x = this.bodyGroups['body'].position.x
    this.bodyGroups['leftArm'].position.x = this.bodyGroups['body'].position.x
    this.bodyGroups['rightArm'].position.x = this.bodyGroups['body'].position.x
  }
}

export default Bear
