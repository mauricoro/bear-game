import Platform from './meshes/platform.js'
import { explode } from './meshes/explosion.js'
import Terrain from './terrain.js'
import Bear from './meshes/bear.js'
import { AudioContext } from 'three'
export function setupListeners(
  character,
  matrix,
  scene,
  movementEnabled,
  geometries,
  materials
) {
  class Movement {
    constructor(keyDown, xVelocity, zVelocity, yRotation) {
      this.keyDown = keyDown
      this.multiplier = this.xVelocity = xVelocity
      this.zVelocity = zVelocity
      this.yRotation = yRotation
    }
  }
  //originally 0.04 before size swap, 0.03
  let w = new Movement(false, -1, 0, Math.PI)
  let a = new Movement(false, 0, 1, (Math.PI * 3) / 2)
  let s = new Movement(false, 1, 0, Math.PI * 2)
  let d = new Movement(false, 0, -1, Math.PI / 2)
  let map = new Map()
  map.set('KeyW', w)
  map.set('KeyA', a)
  map.set('KeyS', s)
  map.set('KeyD', d)

  //test for dash valid
  let dashmultiplier = 2.4

  //platform identifier
  let holdingPlatform = false

  window.addEventListener('keydown', (event) => {
    let characterRotation = character.getRotation()
    let [x, z] = character.getInFrontMatrix()
    let [cx, cz] = character.getPositionMatrix()

    if (event.code == 'Space' && movementEnabled[0]) {
      if (character.notDashing()) {
        dashmultiplier = validDash(matrix.getMatrix(), character)
        // console.log(dashmultiplier)
        let [treez, treex] = treeInPath(
          matrix.getMatrix(),
          character,
          dashmultiplier
        )
        // console.log(treez + ' ' + treex)
        if (treez) {
          const foundGroup = scene.getObjectByName(
            'z' + String(treez) + 'x' + String(treex)
          )
          matrix.setValue(treez, treex, 3)

          console.log(foundGroup)
          scene.remove(foundGroup)
          explode(scene, geometries, materials, treex, treez)
          let testingplatform = new Platform(
            'z' + String(treez) + 'x' + String(treex),
            treez,
            treex
          )
          testingplatform.addToScene(scene)
        }
        character.startDash(dashmultiplier)
      }
    }
    map.forEach((value, key) => {
      if (event.code == key && movementEnabled[0]) {
        value.keyDown = true
        character.startWalking()
        // console.log(character.getMesh().position)
        character.endDash()
      }
    })

    if (event.code == 'KeyP' && movementEnabled[0]) {
      if (holdingPlatform) {
        if (platformLocationValid(x, z, matrix.getMatrix())) {
          // if (matrix[z][x] == 1) {
          if (matrix.getMatrix()[z][x] == 1) {
            // matrix[z][x] = 0
            matrix.setValue(z, x, 0)
            // } else matrix[z][x] = 3
          } else matrix.setValue(z, x, 3)
          character.removePlatform()
          holdingPlatform = false
          let newPlatform = new Platform(
            'z' + String(z) + 'x' + String(x),
            z,
            x
          )
          newPlatform.addToScene(scene)
        }
      } else {
        if (
          platformInFront(x, z, characterRotation, matrix.getMatrix(), cx, cz)
        ) {
          holdingPlatform = true
          console.log('Platform Picked Up')
          character.givePlatform()
          let foundPlatform = scene.getObjectByName(
            'z' + String(z) + 'x' + String(x)
          )
          scene.remove(foundPlatform)
          // matrix[z][x] = 0
          matrix.setValue(z, x, 0)

          // updateLocation()
        }
      }
    }
  })

  window.addEventListener('keyup', (event) => {
    map.forEach((value, key) => {
      if (event.code == key) value.keyDown = false
    })

    if (
      !map.get('KeyW').keyDown &&
      !map.get('KeyA').keyDown &&
      !map.get('KeyS').keyDown &&
      !map.get('KeyD').keyDown
    )
      character.stopWalking()
  })

  return [w, a, s, d, map]
}

function validDash(matrix, entity) {
  let mesh = entity.getMesh()
  let x = mesh.position.x
  let z = mesh.position.z
  const multipliers = [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8]

  let rotation = entity.getRotation()

  for (let i = 1; i < 8; i++) {
    if (
      !validDashPosition(
        x + multipliers[i] * Math.cos(rotation),
        z + multipliers[i] * -1 * Math.sin(rotation),
        matrix
      ) ||
      i == 7
    ) {
      return multipliers[i - 1]
    }
  }
}

function treeInPath(matrix, entity, dashmultiplier) {
  let mesh = entity.getMesh()
  let x = mesh.position.x
  let z = mesh.position.z

  //  Adding the 0.4 to check in front of the end of the dash
  dashmultiplier += 0.4
  const multipliers = [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2]

  let rotation = entity.getRotation()

  for (const multiplier of multipliers) {
    if (multiplier > dashmultiplier) {
      return [false, false]
    } else if (
      matrix[Math.round(-1 * (z + multiplier * -1 * Math.sin(rotation)))][
        Math.round(-1 * (x + multiplier * Math.cos(rotation)))
      ] == 2
    ) {
      return [
        Math.round(-1 * (z + multiplier * -1 * Math.sin(rotation))),
        Math.round(-1 * (x + multiplier * Math.cos(rotation))),
      ]
    }
  }
}

function validDashPosition(x, z, matrix) {
  if (
    Math.round(-1 * x) < 8 &&
    Math.round(-1 * x) > -1 &&
    Math.round(-1 * z) < matrix.length &&
    Math.round(-1 * z) > -1 &&
    matrix[Math.round(-1 * z)][Math.round(-1 * x)] == 0
  ) {
    // matrix[Math.round(-1 * z)][Math.round(-1 * x)] = 0
    return true
  } else return false
}

function platformInFront(x, z, rotation, matrix, cx, cz) {
  // console.log('position' + cz + ' ' + cx)
  // console.log('in front' + z + ' ' + x)
  // console.log(matrix)
  if (matrix[z][x] == 3) {
    return true
  } else return false
}
function platformLocationValid(x, z, matrix) {
  if (matrix[z][x] != 3) {
    return true
  } else return false
}
