import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Platform from './platform.js'
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

    //  For showing the platform
    this.platform = new Platform(0, 0)
    this.platform.setPosition(1, 0.5, 0)
    this.platformMesh = this.platform.getMesh()

    //  For movement distance to be correct
    this.movementMultiplier = [0.072]

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
          { x: this.bodyGroups['body'].position.x + 0.15 }, //originally 0.15 for both before the size swap
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
      const partGeometry = new THREE.BoxGeometry(
        (width * 2) / 3,
        (height * 2) / 3,
        (depth * 2) / 3
      )
      const partColor = new THREE.MeshPhongMaterial({ color: color })
      const part = new THREE.Mesh(partGeometry, partColor)
      part.castShadow = true
      part.position.set((x * 2) / 3, (y * 2) / 3, (z * 2) / 3)
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
    // this.mesh.position.set(-3, 0.14, -3)
    this.mesh.position.set(-3, 0.14, 0)
    this.mesh.rotation.y = Math.PI / 2
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

  getPosition() {
    return [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z]
  }

  getPositionMatrix() {
    return [
      parseInt(Math.round(-1 * this.mesh.position.x)),
      parseInt(Math.round(-1 * this.mesh.position.z)),
    ]
  }

  getInFrontMatrix() {
    return [
      parseInt(Math.round(-1 * (this.mesh.position.x + Math.cos(this.rot)))),
      parseInt(
        Math.round(-1 * (this.mesh.position.z + -1 * Math.sin(this.rot)))
      ),
    ]
  }

  getDistance() {
    return parseInt(Math.round(-1 * this.mesh.position.z))
  }

  //  Movement related methods
  startDash(multiplier = 2.4) {
    // console.log(this.mesh.position.x + ' ' + this.mesh.position.z)
    this.tween = new TWEEN.Tween({
      x: this.mesh.position.x,
      z: this.mesh.position.z,
    })
      .to(
        {
          //  originally 3 before size swap
          x: this.mesh.position.x + multiplier * Math.cos(this.rot),
          z: this.mesh.position.z + multiplier * -1 * Math.sin(this.rot),
        },
        800 * (multiplier / 2.4)
      )
      .onUpdate((coords) => {
        this.mesh.position.x = coords.x
        this.mesh.position.z = coords.z
      })
      .easing(TWEEN.Easing.Exponential.Out)
    this.tween.start()

    //  Ends Tween early to allow movement within 3 seconds after dashing
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

  //Platform Methods
  givePlatform() {
    this.mesh.add(this.platformMesh)
  }
  removePlatform() {
    this.mesh.remove(this.platformMesh)
  }

  //Movement Multiplier Update
  setMultiplier(frames) {
    this.movementMultiplier[0] = 4.32 / frames
  }

  getMultiplier() {
    return this.movementMultiplier
  }
}

export default Bear
