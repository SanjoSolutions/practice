import Decimal from './libs/decimal.mjs'

const items = new Map()

function addItem(item) {
  items.set(item.id, item)
}

addItem({
  id: '5000112548068',
  name: 'Coca Cola (0,5L)',
  price: new Decimal(0.99),
})

addItem({
  id: '4015732007155',
  name: 'Spree Quell Naturell (1,0L)',
  price: new Decimal(0.79),
})

export class Service {
  #hasBeenStarted = false
  onStreamSet = null
  onScannedItemsUpdated = null

  async start() {
    if (!this.#hasBeenStarted) {
      this.#hasBeenStarted = true

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: 'environment' },
        },
      })
      this.onStreamSet(stream)

      const barcodeDetector = new cv.barcode_BarcodeDetector()

      const track = stream.getVideoTracks()[0]
      const settings = track.getSettings()

      const canvas = document.createElement('canvas')
      canvas.width = settings.width
      canvas.height = settings.height
      const context = canvas.getContext('2d')

      const imageCapture = new ImageCapture(track)
      let frame = new cv.Mat(settings.height, settings.width, cv.CV_8UC4)

      const durationToWait = 1000 / settings.frameRate

      let scannedItems = []

      while (true) {
        const frame2 = await imageCapture.grabFrame()
        context.drawImage(frame2, 0, 0)
        frame.data.set(
          context.getImageData(0, 0, frame2.width, frame2.height).data,
        )

        const code = barcodeDetector.detectAndDecode(frame)
        if (code) {
          const item = items.get(code)
          if (item) {
            scannedItems = [...scannedItems, item]
            this.onScannedItemsUpdated(scannedItems)
          }
          await wait(1000)
        } else {
          await wait(durationToWait)
        }
      }
    }
  }
}

async function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}
