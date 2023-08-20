import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { List } from './List.js'
import { service } from './services.js'

function App() {
  const [scannedItems, setScannedItems] = useState([])
  const videoRef = useRef(null)

  const onLoadedData = useCallback(function onLoadedData(event) {
    event.target.play()
  }, [])

  const onStreamSet = useCallback(function onStreamSet(stream) {
    const video = videoRef.current
    video.srcObject = stream
  }, [])

  const onScannedItemsUpdated = useCallback(function onScannedItemsUpdated(
    scannedItems,
  ) {
    setScannedItems(scannedItems)
  }, [])

  useEffect(
    function () {
      service.onStreamSet = onStreamSet
      service.onScannedItemsUpdated = onScannedItemsUpdated
      service.start()
    },
    [onStreamSet, onScannedItemsUpdated],
  )

  return (
    <div className="App">
      <div className="container1">
        <List items={scannedItems} />
      </div>
      <div className="container2">
        <video ref={videoRef} onLoadedData={onLoadedData}></video>
      </div>
    </div>
  )
}

export default App
