import * as TWEEN from '@tweenjs/tween.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import Bear from './meshes/bear.js'
import Chunk from './meshes/chunk.js'
import StartingArea from './meshes/starting-area.js'

import { setup } from './scene-setup.js'
import { terrain } from './terrain.js'
import { setupListeners } from './event-listeners.js'

//  Main function for a video game that I am developing
function main() {
  //  Creating Map for Scene
  const [camera, renderer, scene] = setup()
  const [geometries, materials] = terrain()
  const starting = new StartingArea(scene, geometries, materials)
  const chunk1 = new Chunk(scene, 8, geometries, materials)
  const chunk2 = new Chunk(scene, 16, geometries, materials)
  const chunk3 = new Chunk(scene, 24, geometries, materials)
  const chunk4 = new Chunk(scene, 32, geometries, materials)

  //  Initializing matrix
  let matrix = starting.getMatrix()
  matrix = matrix.concat(chunk1.getMatrix().map((row) => [...row]))
  matrix = matrix.concat(chunk2.getMatrix().map((row) => [...row]))
  matrix = matrix.concat(chunk3.getMatrix().map((row) => [...row]))
  matrix = matrix.concat(chunk4.getMatrix().map((row) => [...row]))

  //  Creating player character
  const character = new Bear()
  character.addToScene(scene)

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

  const [w, a, s, d, map] = setupListeners(character, matrix, scene)

  //From https://threejs.org/manual/#en/responsive
  function render(time) {
    TWEEN.update(time)
    time *= 0.001 // convert time to seconds
    let rotations = []
    let mesh = character.getMesh()

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
            mesh.position.x +
              value.xVelocity +
              ' ' +
              mesh.position.z +
              value.zVelocity +
              ' ' +
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

main()
