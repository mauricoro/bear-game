import Platform from './meshes/platform.js'
export function setupListeners(character, matrix, scene) {
  class Movement {
    constructor(keyDown, xVelocity, zVelocity, yRotation) {
      this.keyDown = keyDown
      this.xVelocity = xVelocity
      this.zVelocity = zVelocity
      this.yRotation = yRotation
    }
  }
  //originally 0.04 before size swap
  let w = new Movement(false, -0.03, 0, Math.PI)
  let a = new Movement(false, 0, 0.03, (Math.PI * 3) / 2)
  let s = new Movement(false, 0.03, 0, Math.PI * 2)
  let d = new Movement(false, 0, -0.03, Math.PI / 2)
  let map = new Map()
  map.set('KeyW', w)
  map.set('KeyA', a)
  map.set('KeyS', s)
  map.set('KeyD', d)

  let keysUp = true

  //test for dash valid
  let dashmultiplier = 2.4
  let treeuuid = false

  //platform identifier
  let holdingPlatform = false

  window.addEventListener('keydown', (event) => {
    if (event.code == 'Space') {
      if (character.notDashing()) {
        dashmultiplier = validDash(matrix, character)
        treeuuid = treeInPath(matrix, character, dashmultiplier)
        console.log(treeuuid)
        if (treeuuid) {
          const foundGroup = scene.getObjectByProperty('uuid', treeuuid)
          console.log(matrix[treeuuid][foundGroup.z])
          matrix[treeuuid][foundGroup.z] = 3
          let zvalue = foundGroup.z
          console.log(treeuuid + ' ' + foundGroup.z)
          scene.remove(foundGroup)
          let testingplatform = new Platform(treeuuid, zvalue)
          testingplatform.addToScene(scene)
        }
        // console.log(dashmultiplier)
        // const foundGroup = scene.getObjectByProperty('uuid', 3)
        // scene.remove(foundGroup)
        // console.log(scene.getObjectByName('testname'))
        character.startDash(dashmultiplier)
      }
    }
    map.forEach((value, key) => {
      if (event.code == key) {
        value.keyDown = true
        character.startWalking()
        // console.log(character.getMesh().position)
        character.endDash()
      }
    })

    if (event.code == 'KeyP') {
      if (holdingPlatform) {
        if (platformLocationValid()) {
          placePlatform()
          holdingPlatform = false
        }
      } else {
        if (platformInFront()) {
          updateLocation()
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
  const multipliers = [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8]

  let rotation = entity.getRotation()

  for (const multiplier of multipliers) {
    if (multiplier > dashmultiplier) {
      return false
    } else if (
      matrix[Math.round(-1 * (z + multiplier * -1 * Math.sin(rotation)))][
        Math.round(-1 * (x + multiplier * Math.cos(rotation)))
      ] == 2
    ) {
      return Math.round(-1 * (z + multiplier * -1 * Math.sin(rotation)))
    }
  }
}

function validDashPosition(x, z, matrix) {
  if (
    Math.round(-1 * x) < 8 &&
    Math.round(-1 * x) > -1 &&
    Math.round(-1 * z) < matrix.length &&
    Math.round(-1 * z) > -1 &&
    matrix[Math.round(-1 * z)][Math.round(-1 * x)] != 1
  ) {
    // matrix[Math.round(-1 * z)][Math.round(-1 * x)] = 0
    return true
  } else return false
}
