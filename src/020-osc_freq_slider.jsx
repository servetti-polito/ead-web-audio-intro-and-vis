/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import './App.css';
import { AudioContextComponent, Slider, ToggleTextButton } from './Tools.jsx'

const audioCtx = new AudioContext();

function App() {

  const defaultOscFrequency = 440;

  const [audioNodes, setAudioNodes] = useState({})

  function start() {
    const osc = new OscillatorNode(audioCtx, { frequency: oscFrequency })
    osc.connect(audioCtx.destination);
    osc.start();
    setAudioNodes( (audioNodes) => ({...audioNodes, osc}))
  }

  function stop() {
    audioNodes.osc.disconnect();
    setAudioNodes( (audioNodes) => ({...audioNodes, osc: null}))
  }

  const [oscFrequency, setOscFrequency] = useState(defaultOscFrequency);

  // executed every time a state changes
  if(audioNodes?.osc) audioNodes.osc.frequency.value = oscFrequency;

  return (
    <>
      <h1>Oscillator with frequency slider</h1>
      <p></p>
      <AudioContextComponent audioCtx={audioCtx}/>
      <p></p>
      <ToggleTextButton handleClick={[start,stop]} text={["Start","Stop"]}/>
      <p></p>
      <Slider label={"Osc1 Frequency"} 
        name="osc1Frequency" min={220} max={3520} step={1} 
        value={oscFrequency}
        handleChange={(ev) => setOscFrequency(ev.target.value)}
      />
    </>
  )
}



export default App
