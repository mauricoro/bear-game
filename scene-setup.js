import * as THREE from 'three'

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

  return [camera, renderer, scene]
}
