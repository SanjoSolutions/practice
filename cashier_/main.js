import Decimal from './decimal.mjs'

const stream = await navigator.mediaDevices.getUserMedia({video: true})
const video = document.createElement('video')
video.width = 1080
video.height = 720
video.srcObject = stream
document.body.appendChild(video)
await video.play()

const barcodeDetector = new cv.barcode_BarcodeDetector()

const videoCapture = new cv.VideoCapture(video)
let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4)

const FPS = 30
const durationToWait = 1000 / FPS

const items = new Map()

function addItem(item) {
  items.set(item.id, item)
}

addItem({
  id: '5000112548068',
  name: 'Coca Cola (0,5L)',
  price: new Decimal(0.99)
})

const scannedItems = []

async function wait(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

function calculateTotal() {
  return sum(scannedItems.map(({price}) => price))
}

function sum(values) {
  return values.reduce(add)
}

function add(a, b) {
  return Decimal.add(a, b)
}

window.calculateTotal = calculateTotal

while (true) {
  videoCapture.read(frame)
  const code = barcodeDetector.detectAndDecode(frame)
  if (code) {
    const item = items.get(code)
    if (item) {
      scannedItems.push(item)
    }
    console.log('scanned items', scannedItems)
    await wait(1000)
  } else {
    await wait(durationToWait)
  }
}
