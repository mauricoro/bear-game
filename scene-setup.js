// import * as THREE from 'three'
import * as THREE from './libraries/three/build/three.module.js'
// import * as TWEEN from '@tweenjs/tween.js'
import * as TWEEN from './libraries/@tweenjs/tween.js'

export function setup() {
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
  camera.position.set(2, 6, -4)
  // camera.position.set(2, 6, -5)
  camera.lookAt(-2, 0, -5)
  camera.position.set(-3, 3, -4)
  camera.lookAt(-3, 2, 0)

  // camera.position.set(2, 2, -2)
  // camera.lookAt(-2, 0, -2)

  const scene = new THREE.Scene()

  const color = 0xffffff
  const intensity = 3
  let light = new THREE.DirectionalLight(color, intensity)

  // light.position.set(3, 20, -20)
  light.position.set(-10, 15, -5)
  light.castShadow = true

  //Makes light shadow box 10, 25

  const side = 15
  light.shadow.camera.top = side
  light.shadow.camera.bottom = -side
  light.shadow.camera.left = side
  light.shadow.camera.right = -side
  light.shadow.camera.near = 0.01 // same as the camera
  light.shadow.camera.far = 1000 // same as the camera
  light.shadow.camera.fov = 5000 // same as the camera
  light.shadow.mapSize.width = 2048
  light.shadow.mapSize.height = 2048

  scene.add(light)

  const ambientLight = new THREE.AmbientLight(0x404040, 15)
  scene.add(ambientLight)

  //Button Testing
  const startButton = document.querySelector('#title-button')
  const titleDiv = document.querySelector('#title')
  const targetPosition = new THREE.Vector3(2, 6, -4)
  const lightTarget = new THREE.Vector3(3, 20, -20)
  const targetObject = new THREE.Object3D()
  targetObject.position.set(-3, 2, 0)
  const startingView = new THREE.Vector2(-3, 2, 0)
  const targetView = new THREE.Vector3(-2, 0, -5)

  let movementEnabled = [false]

  const tween = new TWEEN.Tween(camera.position)
    .to(targetPosition, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)

  const tween2 = new TWEEN.Tween(targetObject.position)
    .to(targetView, 2000)
    .onUpdate(() => {
      camera.lookAt(targetObject.position)
    })
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(() => {
      movementEnabled[0] = true
    })

  const tween3 = new TWEEN.Tween(light.position)
    .to(lightTarget, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)

  startButton.addEventListener('click', function () {
    tween.start()
    tween2.start()
    tween3.start()
    startButton.disabled = true
    startButton.classList.add('fade-out')
    titleDiv.classList.add('fade-out')
  })
  //End of button testing

  return [camera, renderer, scene, light, movementEnabled]
}
