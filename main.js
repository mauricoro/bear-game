import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import Bear from './bear.js'
import Chunk from './chunk.js'
import StartingArea from './starting-area.js'

//  Main function for a video game that I am developing
function main() {
  //  Creating Map for Scene
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.setClearColor(0x87ceeb, 1)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  //  Initializing Camera
  const fov = 75
  const aspect = 2 // canvas default
  const near = 0.1
  const far = 50

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  // camera.position.set(9, 9, 2)
  // camera.position.set(5, 6, 1)
  // camera.lookAt(0, 0, 0)

  // camera.position.set(3, 6, -1)
  // camera.lookAt(-2, 0, -2)
  camera.position.set(2, 6, -3)
  camera.lookAt(-2, 0, -5)
  const scene = new THREE.Scene()

  const color = 0xffffff
  const intensity = 3
  const light = new THREE.DirectionalLight(color, intensity)

  light.position.set(3, 20, -20)

  light.castShadow = true

  //Makes light shadow box 10
  const side = 25
  light.shadow.camera.top = side
  light.shadow.camera.bottom = -side
  light.shadow.camera.left = side
  light.shadow.camera.right = -side
  light.shadow.camera.near = 0.01 // same as the camera
  light.shadow.camera.far = 1000 // same as the camera
  light.shadow.camera.fov = 50 // same as the camera
  light.shadow.mapSize.width = 2048
  light.shadow.mapSize.height = 2048

  scene.add(light)

  const ambientLight = new THREE.AmbientLight(0x404040, 15)
  scene.add(ambientLight)

  // Terrain
  // const boxWidth = 1
  // const boxHeight = 1
  // const boxDepth = 1
  // const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

  // function makeInstance(geometry, color, x, y, z) {
  //   const material = new THREE.MeshPhongMaterial({ color })

  //   const cube = new THREE.Mesh(geometry, material)
  //   if (y > 0) {
  //     cube.castShadow = true
  //   }
  //   cube.receiveShadow = true
  //   scene.add(cube)

  //   // cube.position.x = x
  //   cube.position.set(x, y, z)

  //   return cube
  // }

  // let cubes = []
  // for (let i = 0; i > -8; i--) {
  //   //16
  //   for (let j = 0; j > -8; j--) {
  //     //32
  //     cubes.push(makeInstance(geometry, 0x8dc24d, i, 0, j))
  //     if (i == 0) {
  //       cubes.push(makeInstance(geometry, 0x8dc24d, i, -1, j))
  //       cubes.push(makeInstance(geometry, 0x54575c, i, -2, j))
  //       cubes.push(makeInstance(geometry, 0x54575c, i, -3, j))
  //       cubes.push(makeInstance(geometry, 0x54575c, i, -4, j))
  //     }
  //   }
  // }
  const starting = new StartingArea(scene)
  starting.addToScene(scene)
  const testing = new Chunk(scene)
  testing.addToScene(scene)

  // let matrix = []
  // for (let i = 0; i < 8; i++) {
  //   matrix[i] = []
  //   for (let j = 0; j < 8; j++) {
  //     matrix[i][j] = 0
  //   }
  // }
  // matrix[3][4] = 2
  let matrix = starting.getMatrix()

  matrix = matrix.concat(testing.getMatrix().map((row) => [...row]))
  // console.log(matrix)

  //bear
  const character = new Bear()
  character.addToScene(scene)
  //  console.log(character.getMesh().position)

  //From https://threejs.org/manual/#en/responsive
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
    const width = (canvas.clientWidth * pixelRatio) | 0
    const height = (canvas.clientHeight * pixelRatio) | 0
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  class Movement {
    constructor(keyDown, xVelocity, zVelocity, yRotation) {
      this.keyDown = keyDown
      this.xVelocity = xVelocity
      this.zVelocity = zVelocity
      this.yRotation = yRotation
    }
  }

  //originall 0.04 before size swap
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
  window.addEventListener('keydown', (event) => {
    if (event.code == 'Space') {
      if (character.notDashing()) {
        dashmultiplier = validDash(matrix, character)
        treeuuid = treeInPath(matrix, character, dashmultiplier)
        console.log(treeuuid)
        if (treeuuid) {
          const foundGroup = scene.getObjectByProperty('uuid', treeuuid)
          scene.remove(foundGroup)
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

  //From https://threejs.org/manual/#en/responsive
  function render(time) {
    TWEEN.update(time)
    time *= 0.001 // convert time to seconds
    let count = 0
    let rotations = []
    let mesh = character.getMesh()
    //Update Camera Position
    // camera.position.set(
    //   10 + character.getMesh().position.x,
    //   9 + character.getMesh().position.y,
    //   2 + character.getMesh().position.z
    //

    // Camera on rails
    // camera.position.set(5, 6, 1 - time * 0.2)
    // camera.lookAt(0 - time, 0, 0 - time)
    map.forEach((value, key) => {
      if (value.keyDown == true) {
        if (
          validPosition(
            mesh.position.x + value.xVelocity * 10,
            mesh.position.z + value.zVelocity * 10,
            matrix
          )
        ) {
          console.log(
            parseInt(Math.round(-1 * (mesh.position.x + value.xVelocity))) +
              ' ' +
              parseInt(Math.round(-1 * (mesh.position.z + value.zVelocity)))
          )
          mesh.position.x += value.xVelocity
          mesh.position.z += value.zVelocity
        }

        rotations.push(value.yRotation)
      }
    })

    if (rotations.length > 0) {
      let sum = rotations.reduce(
        (total, currentValue) => total + currentValue,
        0
      )
      if (s.keyDown && d.keyDown) {
        sum -= Math.PI * 2
      }
      if ((a.keyDown && s.keyDown && d.keyDown) || rotations.length == 4) {
        sum = 0
      }

      mesh.rotation.y = sum / rotations.length
      character.setRotation(sum / rotations.length)
    }

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

function validDash(matrix, entity) {
  let mesh = entity.getMesh()
  let x = mesh.position.x
  let z = mesh.position.z
  const multipliers = [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8]

  let rotation = entity.getRotation()

  for (let i = 1; i < 8; i++) {
    if (
      !validPosition(
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

function validTree(x, z, matrix) {
  if (matrix[Math.round(-1 * z)][Math.round(-1 * x)] != 2) return true
  else return false
}
function validPosition(x, z, matrix) {
  if (
    Math.round(-1 * x) < 8 &&
    Math.round(-1 * x) > -1 &&
    Math.round(-1 * z) < matrix.length &&
    Math.round(-1 * z) > -1 &&
    matrix[Math.round(-1 * z)][Math.round(-1 * x)] == 0
  )
    return true
  else return false
}

function getMultiplier(matrix, entity) {}
main()
