import * as THREE from 'three'

export function terrain() {
  const geometries = new Map()
  geometries.set('block', new THREE.BoxGeometry(1, 1, 1))
  geometries.set('trunk', new THREE.BoxGeometry(0.7, 2, 0.7))
  geometries.set('leaves', new THREE.BoxGeometry(1.5, 1.3, 1.5))
  geometries.set('water', new THREE.BoxGeometry(1, 0.8, 1))

  const materials = new Map()
  materials.set('grass', new THREE.MeshPhongMaterial({ color: 0x8dc24d }))
  materials.set('water', new THREE.MeshPhongMaterial({ color: 0x5c71fa }))
  materials.set('dirt', new THREE.MeshPhongMaterial({ color: 0x8f6f3d }))
  materials.set('trunk', new THREE.MeshPhongMaterial({ color: 0x432616 }))
  materials.set('leaves', new THREE.MeshPhongMaterial({ color: 0x087830 }))

  return [geometries, materials]
}
