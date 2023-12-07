// import * as TWEEN from '@tweenjs/tween.js'
import * as TWEEN from './libraries/@tweenjs/tween.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import Bear from './meshes/bear.js'
import Chunk from './meshes/chunk.js'
import StartingArea from './meshes/starting-area.js'
import Terrain from './terrain.js'
import { setup } from './scene-setup.js'
import { terrain } from './terrain.js'
import { setupListeners } from './event-listeners.js'

//  Main function for a video game that I am developing

function main() {
  //  Creating Map for Scene
  let [camera, renderer, scene, light, movementEnabled] = setup()
  const [geometries, materials] = terrain()
  const starting = new StartingArea(scene, geometries, materials)
  const chunk1 = new Chunk(scene, 8, geometries, materials)
  const chunk2 = new Chunk(scene, 16, geometries, materials)
  const chunk3 = new Chunk(scene, 24, geometries, materials)
  const chunk4 = new Chunk(scene, 32, geometries, materials)

  //  Initializing matrix
  let matrix = new Terrain(starting.getMatrix())
  matrix.append(chunk1.getMatrix())
  matrix.append(chunk2.getMatrix())
  matrix.append(chunk3.getMatrix())
  matrix.append(chunk4.getMatrix())

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

  const [w, a, s, d, map] = setupListeners(
    character,
    matrix,
    scene,
    movementEnabled
  )

  let distanceEdge = 32
  let cameraPosition = -4
  let cameraSpeed = 0.8
  let lastTime = 0

  //Score
  const score = document.querySelector('#overlay')
  score.textContent = 'test1'
  let distanceScore = 0
  let gameOver = false

  //Light target
  scene.add(light.target)
  light.target = character.getMesh()

  //From https://threejs.org/manual/#en/responsive
  function render(time) {
    TWEEN.update(time)
    time *= 0.001 // convert time to seconds
    let rotations = []
    let mesh = character.getMesh()

    if (movementEnabled[0] && lastTime == 0) {
      lastTime = time
      score.classList.add('fade-in')
    }
    // Render new chunks once distance is close
    if (distanceEdge + camera.position.z < 21) {
      console.log('increasing')
      cameraPosition = cameraPosition - (time - lastTime) * cameraSpeed
      lastTime = time
      cameraSpeed = cameraSpeed + 0.05
      distanceEdge += 8
      let newChunk = new Chunk(scene, distanceEdge, geometries, materials)
      matrix.append(newChunk.getMatrix())
    }

    //  Score
    distanceScore = Math.max(distanceScore, character.getDistance())
    // score.textContent = Math.round(time)
    score.textContent = 'Score: ' + distanceScore
    if (gameOver) {
      movementEnabled[0] = false
    }
    //  Update Light Position Based on Character
    const [bx, by, bz] = character.getPosition()
    if (bz - camera.position.z > 10) {
      gameOver = true
      console.log('gameover')
      // score.classList.add('game-over')
      score.style.left = '50%'
      score.style.top = '40%'
      score.style.transform = 'translate(-50%, -50%)'
      score.style.transition = 'top 2s, left 2s'
      // score.style.fontSize ='100px'
    }

    // Update Light Position Based on Character
    //  Camera on rails
    if (movementEnabled[0]) {
      light.position.set(bx + 6, 20, bz - 20)
      camera.position.set(
        2,
        6,
        cameraPosition - (time - lastTime) * cameraSpeed
      )
    }
    // camera.position.set(2, 6, -3)

    map.forEach((value, key) => {
      if (value.keyDown == true) {
        if (
          validPosition(
            mesh.position.x + value.xVelocity * 10,
            mesh.position.z + value.zVelocity * 10,
            matrix
          )
        ) {
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
      // console.log(sum / rotations.length)
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
    Math.round(-1 * z) < matrix.getMatrix().length &&
    Math.round(-1 * z) > -1 &&
    matrix.getMatrix()[Math.round(-1 * z)][Math.round(-1 * x)] == 0
  )
    return true
  else return false
}

main()
