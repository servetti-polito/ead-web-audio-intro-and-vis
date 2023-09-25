/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import './App.css';
import { AudioContextComponent, Slider, ToggleTextButton } from './Tools.jsx'

const audioCtx = new AudioContext();

function App() {

  const defaultOsc1Frequency = 440;

  const [audioNodes, setAudioNodes] = useState({})

  function start() {
    const osc = new OscillatorNode(audioCtx, { frequency: osc1Frequency })
    osc.connect(audioCtx.destination);
    osc.start();
    setAudioNodes( (audioNodes) => ({...audioNodes, osc}))
  }

  function stop() {
    audioNodes.osc.disconnect();
    setAudioNodes( (audioNodes) => ({...audioNodes, osc: null}))
  }

  const [osc1Frequency, setOsc1Frequency] = useState(defaultOsc1Frequency);

  // executed every time a state changes
  if(audioNodes?.osc) audioNodes.osc.frequency.value = osc1Frequency;

  return (
    <>
      <h1>Oscillator with frequency slider</h1>
      <p></p>
      <AudioContextComponent audioCtx={audioCtx}/>
      <p></p>
      <ToggleTextButton handleClick={[start,stop]} text={["Start","Stop"]}/>
      <p></p>
      <Slider value={osc1Frequency} handleChange={(ev) => setOsc1Frequency(ev.target.value)}></Slider>
    </>
  )
}



export default App
