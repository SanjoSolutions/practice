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

while (true) {
  videoCapture.read(frame)
  const code = barcodeDetector.detectAndDecode(frame)
  if (code) {
    console.log('code', code)
  }
  await wait(durationToWait)
}

async function wait(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
