import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export function explode(scene, geometries, materials, x, z) {
  console.log(geometries.get('trunkbit'))
  let bits = [
    new THREE.Mesh(geometries.get('trunkbit'), materials.get('trunkbit')),
    new THREE.Mesh(geometries.get('trunkbit'), materials.get('trunkbit')),
    new THREE.Mesh(geometries.get('trunkbit'), materials.get('trunkbit')),
    new THREE.Mesh(geometries.get('trunkbit'), materials.get('trunkbit')),
    new THREE.Mesh(geometries.get('leafbit'), materials.get('leafbit')),
    new THREE.Mesh(geometries.get('leafbit'), materials.get('leafbit')),
    new THREE.Mesh(geometries.get('leafbit'), materials.get('leafbit')),
    new THREE.Mesh(geometries.get('leafbit'), materials.get('leafbit')),
  ]

  //   for (const bit of bits) {
  //     console.log(bit)
  //     console.log(scene)
  //     bit.position.set(-1 * x, Math.random() * 2 + 1, -1 * z)
  //     scene.add(bit)
  //   }
  let xdiff = [
    1.5 * Math.random(),
    -1.5 * Math.random(),
    0,
    0,
    1.5 * Math.random(),
    -1.5 * Math.random(),
    0,
    0,
  ]
  let zdiff = [
    0,
    0,
    1.5 * Math.random(),
    -1.5 * Math.random(),
    0,
    0,
    1.5 * Math.random(),
    -1.5 * Math.random(),
  ]
  let tweens = []

  for (let i = 0; i < 8; i++) {
    if (i < 4) {
      bits[i].position.set(-1 * x, Math.random() * 1.5 + 1, -1 * z)
    } else {
      bits[i].position.set(-1 * x, Math.random() + 2.5, -1 * z)
    }
    scene.add(bits[i])

    let bittween = new TWEEN.Tween({
      x: bits[i].position.x,
      //   y: bits[i].position.y,
      z: bits[i].position.z,
    })
      .to(
        {
          //  originally 3 before size swap
          x: bits[i].position.x + xdiff[i],
          //   y: -0.5,
          z: bits[i].position.z + zdiff[i],
        },
        2000
      )
      .onUpdate((coords) => {
        bits[i].position.x = coords.x
        // bits[i].position.y = coords.y
        bits[i].position.z = coords.z
      })
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(function () {
        scene.remove(bits[i])
      })

    let othertween = new TWEEN.Tween({
      y: bits[i].position.y,
    })
      .to(
        {
          y: bits[i].position.y + 0.3,
        },
        200
      )
      .onUpdate((coords) => {
        bits[i].position.y = coords.y
      })
      //   .easing(TWEEN.Easing.Exponential.Out)
      .easing(TWEEN.Easing.Exponential.Out)

    let othertween2 = new TWEEN.Tween({
      y: bits[i].position.y + 0.3,
    })
      .to(
        {
          y: -1,
        },
        1000
      )
      .onUpdate((coords) => {
        bits[i].position.y = coords.y
      })
      //   .easing(TWEEN.Easing.Exponential.Out)
      .easing(TWEEN.Easing.Quadratic.In)

    othertween.chain(othertween2)
    tweens.push(bittween)
    tweens.push(othertween)
  }

  for (let i = 0; i < tweens.length; i++) {
    console.log('started')
    tweens[i].start()
  }

  console.log('exploded')
}
