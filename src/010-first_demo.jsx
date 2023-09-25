import { useState, useEffect } from 'react';

const audioCtx = new AudioContext();

function App() {

  const [audioNodes, setAudioNodes] = useState({
    osc1: new OscillatorNode(audioCtx)
  })

  useEffect( () => {
    audioNodes.osc1.connect(audioCtx.destination);
    audioNodes.osc1.start();
  }, [])

  const [audioContextState, setAudioContextState] = useState( audioCtx.state == "running"  )

  function handleAudioContextStateChange(ev) {  
    setAudioContextState(ev.target.checked);  
    if (ev.target.checked) audioCtx.resume();
    else audioCtx.suspend(); 
  }

  return (
    <>
      <h1>EAD</h1>
      <label htmlFor="audioContextState">AudioContext state: {audioContextState}</label>
      <input type="checkbox" id="audioContextState" name="audioContextState"
        checked={audioContextState} onChange={ (ev) => handleAudioContextStateChange(ev) } />
      {/* audioCtx.state */ /* WARNING: state is not timely updated in the view */}
    </>
  )
}

export default App
