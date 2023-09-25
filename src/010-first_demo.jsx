/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import './App.css';
import { AudioContextComponent, Slider, OneTimeButton } from './Tools.jsx'

const audioCtx = new AudioContext();

function App() {

  const [audioNodes, setAudioNodes] = useState({})

  function start() {
    const osc = new OscillatorNode(audioCtx)
    osc.connect(audioCtx.destination);
    osc.start();
    setAudioNodes( (audioNodes) => ({...audioNodes, osc}))
  }


  return (
    <>
      <h1>First demo</h1>
      <p></p>
      <AudioContextComponent audioCtx={audioCtx}/>
      <p></p>
      <OneTimeButton handleClick={start}>Start</OneTimeButton>
    </>
  )
}



export default App
