import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { List } from './List.js'
import { service } from './services.js'

function App() {
  const [scannedItems, setScannedItems] = useState([])
  const videoRef = useRef(null)

  const onStreamSet = useCallback(function onStreamSet(stream) {
    const video = videoRef.current
    video.srcObject = stream
    video.play()
  }, [])

  const onScannedItemsUpdated = useCallback(function (scannedItems) {
    setScannedItems(scannedItems)
  }, [])

  useEffect(
    function () {
      service.onStreamSet = onStreamSet
      service.onScannedItemsUpdated = onScannedItemsUpdated
      service.start()

      return function () {
        service.onStreamSet = null
        service.onScannedItemsUpdated = null
      }
    },
    [onStreamSet, onScannedItemsUpdated],
  )

  return (
    <div className="App">
      <div className="container1">
        <List items={scannedItems} />
      </div>
      <div className="container2">
        <video ref={videoRef}></video>
      </div>
    </div>
  )
}

export default App
