/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';

function AudioContextComponent(props) {
  const audioCtx = props.audioCtx;
  const [audioContextState, setAudioContextState] = useState( audioCtx.state == 'running' );

  useEffect( () => {
    audioCtx.addEventListener('statechange', () => {
      console.log('statechange', audioCtx.state);
      setAudioContextState(audioCtx.state == 'running')
    });
  }, [])

  function handleAudioContextStateChange(ev) {
    const checked = ev.target.checked
    setAudioContextState(checked);
    if (checked) audioCtx.resume(); else audioCtx.suspend();
  }

  return(
    <div>
    <label htmlFor="audioContextState">AudioContext state: {audioContextState}</label>
    <input type="checkbox" id="audioContextState" name="audioContextState"
      checked={audioContextState} onChange={ (ev) => handleAudioContextStateChange(ev) } />
    {/* audioCtx.state */ /* WARNING: state is not timely updated in the view */}
    </div>
  )
  
}


function ToggleTextButton(props) {
  const [flag, setFlag] = useState(false);
  return(
    <div>
    <button onClick={() => { setFlag(!flag); props.handleClick[+flag]()}} >{props.text[+flag]}</button>
    </div>
  )
}

function OneTimeButton(props) {
  const [flag, setFlag] = useState(false);
  return(
    <div>
    <button onClick={() => { setFlag(true); props.handleClick()}} disabled={flag}>{props.children}</button>
  </div>
  )
}

function Slider(props) {
  return(
    <div>
    <input type="range" id="osc1Frequency" name="osc1Frequency" min="220" max="1760" step="1" value={props.value}
      onChange={props.handleChange} />
    <label htmlFor="osc1Frequency"> osc1Frequency: {props.value} </label>
  </div>
  )
}

export  { Slider, OneTimeButton, ToggleTextButton, AudioContextComponent} ;