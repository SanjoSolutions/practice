/// <reference types="three" />
import * as THREE from './node_modules/three/build/three.module.js'

class GridHelper2 extends THREE.LineSegments {
  constructor(
    size = 10,
    divisions = 10,
    y = 0,
    color1 = 0x444444,
    color2 = 0x888888
  ) {
    color1 = new THREE.Color(color1)
    color2 = new THREE.Color(color2)

    const center = divisions / 2
    const step = size / divisions
    const halfSize = size / 2

    const vertices = [],
      colors = []

    for (let i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {
      vertices.push(-halfSize, y, k, halfSize, y, k)
      vertices.push(k, y, -halfSize, k, y, halfSize)

      const color = i === center ? color1 : color2

      color.toArray(colors, j)
      j += 3
      color.toArray(colors, j)
      j += 3
      color.toArray(colors, j)
      j += 3
      color.toArray(colors, j)
      j += 3
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      toneMapped: false,
    })

    super(geometry, material)

    this.type = 'GridHelper2'
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}

const LENGTH = 50
const PLANE_LENGTH = 1200

let tool = 1
let camera, scene, renderer
let plane
let pointer,
  raycaster,
  isShiftDown = false

let rollOverMesh, rollOverMaterial
let cubeGeo, cubeMaterial
let gridHelper
const ySerialized = localStorage.getItem('y')
let y = ySerialized ? Number(ySerialized) : 0
let firstPosition = null

const objects = []

init()
render()

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  )
  camera.position.set(500, 800, 1300)
  camera.lookAt(0, 0, 0)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // roll-over helpers

  const rollOverGeo = new THREE.BoxGeometry(LENGTH, LENGTH, LENGTH)
  rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.5,
    transparent: true,
  })
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
  scene.add(rollOverMesh)

  // cubes

  const map = new THREE.TextureLoader().load(
    'textures/square-outline-textured.png',
    render
  )
  map.colorSpace = THREE.SRGBColorSpace
  cubeGeo = new THREE.BoxGeometry(LENGTH, LENGTH, LENGTH)
  cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xfeb74c,
    map: map,
  })

  // grid

  gridHelper = createGridHelper(y)
  scene.add(gridHelper)

  //

  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()

  const geometry = new THREE.PlaneGeometry(PLANE_LENGTH, PLANE_LENGTH)
  geometry.rotateX(-Math.PI / 2)

  plane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ visible: false })
  )
  scene.add(plane)

  objects.push(plane)

  // lights

  const ambientLight = new THREE.AmbientLight(0x606060, 3)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
  directionalLight.position.set(1, 0.75, 0.5).normalize()
  scene.add(directionalLight)

  const state = readState()
  for (const y in state) {
    if (Object.hasOwnProperty.call(state, y)) {
      const a = state[y]
      for (const z in a) {
        if (Object.hasOwnProperty.call(a, z)) {
          const b = a[z]
          for (const x in b) {
            if (Object.hasOwnProperty.call(b, x)) {
              const position = new THREE.Vector3(
                Number(x),
                Number(y),
                Number(z)
              )
              createAndAddVoxel(position)
            }
          }
        }
      }
    }
  }

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onDocumentKeyDown)
  document.addEventListener('keyup', onDocumentKeyUp)

  //

  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

  render()
}

function onPointerMove(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  )

  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObjects(objects, false)

  if (intersects.length > 0) {
    const intersect = intersects[0]

    rollOverMesh.position.copy(intersect.point).add(intersect.face.normal)
    rollOverMesh.position
      .divideScalar(LENGTH)
      .floor()
      .multiplyScalar(LENGTH)
      .addScalar(0.5 * LENGTH)

    render()
  }
}

function onPointerDown(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  )

  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObjects(objects, false)

  if (intersects.length > 0) {
    const intersect = intersects[0]

    if (tool === 1) {
      // delete cube

      if (isShiftDown) {
        if (intersect.object !== plane) {
          scene.remove(intersect.object)

          objects.splice(objects.indexOf(intersect.object), 1)

          removeVoxelFromPersistedState(intersect.object)
        }

        // create cube
      } else {
        const position = new THREE.Vector3()
        position.copy(intersect.point).add(intersect.face.normal)
        position
          .divideScalar(LENGTH)
          .floor()
          .multiplyScalar(LENGTH)
          .addScalar(0.5 * LENGTH)

        createAndAddVoxelWithPersistence(position)
      }

      render()
    } else if (tool === 2) {
      if (!firstPosition) {
        firstPosition = new THREE.Vector3()
        firstPosition.copy(intersect.point).add(intersect.face.normal)
        firstPosition
          .divideScalar(LENGTH)
          .floor()
          .multiplyScalar(LENGTH)
          .addScalar(0.5 * LENGTH)
      } else {
        const secondPosition = new THREE.Vector3()
        secondPosition.copy(intersect.point).add(intersect.face.normal)
        secondPosition
          .divideScalar(LENGTH)
          .floor()
          .multiplyScalar(LENGTH)
          .addScalar(0.5 * LENGTH)

        fill(firstPosition, secondPosition, { hollow: true })
        render()

        firstPosition = null
      }
    }
  }
}

function fill(from, to, options = { hollow: false }) {
  const createdVoxels = []
  const x1 = Math.min(from.x, to.x)
  const y1 = Math.min(from.y, to.y)
  const z1 = Math.min(from.z, to.z)
  const x2 = Math.max(from.x, to.x)
  const y2 = Math.max(from.y, to.y)
  const z2 = Math.max(from.z, to.z)
  for (let y = y1; y <= y2; y += LENGTH) {
    for (let z = z1; z <= z2; z += LENGTH) {
      for (let x = x1; x <= x2; x += LENGTH) {
        if (options.hollow) {
          if (
            x === from.x ||
            x === to.x ||
            y === from.y ||
            y === to.y ||
            z === from.z ||
            z === to.z
          ) {
            const position = new THREE.Vector3(x, y, z)
            createdVoxels.push(createAndAddVoxel(position))
          }
        } else {
          const position = new THREE.Vector3(x, y, z)
          createdVoxels.push(createAndAddVoxel(position))
        }
      }
    }
  }
  if (createdVoxels.length >= 1) {
    persistVoxels(createdVoxels)
  }
}

function createAndAddVoxel(position) {
  const voxel = new THREE.Mesh(cubeGeo, cubeMaterial)
  voxel.position.copy(position)
  scene.add(voxel)

  objects.push(voxel)

  return voxel
}

function createAndAddVoxelWithPersistence(position) {
  const voxel = createAndAddVoxel(position)
  persistVoxel(voxel)
}

function readState() {
  const stateSerialized = localStorage.getItem('state')
  const state = stateSerialized ? JSON.parse(stateSerialized) : {}
  return state
}

function persistVoxels(voxels) {
  const state = readState()

  for (const voxel of voxels) {
    const position = voxel.position
    let a = state[position.y]
    if (!a) {
      a = {}
      state[position.y] = a
    }
    let b = a[position.z]
    if (!b) {
      b = {}
      a[position.z] = b
    }
    b[position.x] = true
  }

  saveState(state)
}

function persistVoxel(voxel) {
  persistVoxels([voxel])
}

function removeVoxelFromPersistedState(voxel) {
  const state = readState()

  const position = voxel.position
  const a = state[position.y]
  if (a) {
    const b = a[position.z]
    if (b && b[position.x]) {
      delete b[position.x]
    }
  }

  saveState(state)
}

function saveState(state) {
  const updatedStateSerialized = JSON.stringify(state)
  localStorage.setItem('state', updatedStateSerialized)
}

function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 16:
      isShiftDown = true
      break
  }
  switch (event.code) {
    case 'ArrowDown':
      y -= LENGTH

      plane.position.y = y

      scene.remove(gridHelper)
      gridHelper = createGridHelper(y)
      scene.add(gridHelper)

      render()

      localStorage.setItem('y', y)

      break
    case 'ArrowUp':
      y += LENGTH

      plane.position.y = y

      scene.remove(gridHelper)
      gridHelper = createGridHelper(y)
      scene.add(gridHelper)

      render()

      localStorage.setItem('y', y)

      break
    case 'Digit1':
      tool = 1
      break
    case 'Digit2':
      tool = 2
      break
  }
}

function createGridHelper(z) {
  return new GridHelper2(PLANE_LENGTH, PLANE_LENGTH / LENGTH, z)
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    case 16:
      isShiftDown = false
      break
  }
}

function render() {
  renderer.render(scene, camera)
}
