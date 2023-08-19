import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { List } from './List.js'
import { service } from './services.js'

function App() {
  console.log('App')

  const [scannedItems, setScannedItems] = useState([])
  const videoRef = useRef(null)

  const onStreamSet = useCallback(
    function onStreamSet(stream) {
      const video = videoRef.current
      video.srcObject = stream
      video.play()
    },
    [videoRef]
  )

  service.setScannedItems = setScannedItems
  service.onStreamSet = onStreamSet

  useEffect(
    function () {
      service.videoRef = videoRef
    },
    [videoRef]
  )

  useEffect(function () {
    service.run()
  }, [])

  return (
    <div className='App'>
      <div className='container1'>
        <List items={scannedItems} />
      </div>
      <div className='container2'>
        <video ref={videoRef}></video>
      </div>
    </div>
  )
}

export default App
