/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';

function AudioContextComponent(props) {
  const audioCtx = props.audioCtx;
  const [audioContextState, setAudioContextState] = useState(audioCtx.state == 'running');

  useEffect(() => {
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

  return (
    <div>
      <label htmlFor="audioContextState">AudioContext state: {audioContextState}</label>
      <input type="checkbox" id="audioContextState" name="audioContextState"
        checked={audioContextState} onChange={(ev) => handleAudioContextStateChange(ev)} />
      {/* audioCtx.state */ /* WARNING: state is not timely updated in the view */}
    </div>
  )

}


function ToggleTextButtonFlag(props) {
  const flag = props.flag;
  return (
    <div>
      <button onClick={() => { props.handleClick[+flag]() }} >{props.text[+flag]}</button>
    </div>
  )
}



function ToggleTextButton(props) {
  // <ToggleTextButton handleClick={[ () => audioEl.current.play(), () => audioEl.current.pause() ]} text={["Play", "Pause"]} />
  const [flag, setFlag] = useState(false);
  return (
    <div>
      <button onClick={() => { setFlag(!flag); props.handleClick[+flag]() }} >
        {props.text[+flag]}
      </button>
    </div>
  )
}

function CheckboxController(props) {
  const [flag, setFlag] = useState(props.init);
  return (
        <div>
        <label htmlFor="flag">{props.textLabel}: {flag}</label>
        <input type="checkbox" id="flag" name="flag"
          checked={flag} onChange={ () => { setFlag(!flag); props.handleChange(!flag) } }/>
      </div>
  )
}

function OneTimeButton(props) {
  // <OneTimeButton handleClick={start}>Start</OneTimeButton>
  const [flag, setFlag] = useState(false);
  return (
    <div>
      <button onClick={() => { setFlag(true); props.handleClick() }} disabled={flag}>{props.children}</button>
    </div>
  )
}

function Slider({handleChange, ...props}) {
  //       <Slider label={"osc1Frequency"} value={osc1Frequency} handleChange={(ev) => setOsc1Frequency(ev.target.value)}></Slider>
  return (
    <div>
      <input id={props.name} type="range" {...props} onChange={handleChange} />
      <label htmlFor={props.name}> {props.label}: {props.value} </label>
    </div>
  )
}

export { Slider, OneTimeButton, ToggleTextButton, ToggleTextButtonFlag, CheckboxController, AudioContextComponent };