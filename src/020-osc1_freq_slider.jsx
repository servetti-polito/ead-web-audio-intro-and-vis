import { useState, useEffect } from 'react';

const audioCtx = new AudioContext();

function App() {

  const defaultOsc1Frequency = 440;

  const [audioNodes, setAudioNodes] = useState({
    osc1: new OscillatorNode(audioCtx, { frequency: defaultOsc1Frequency })
  })

  useEffect(() => {
    audioNodes.osc1.connect(audioCtx.destination);
    audioNodes.osc1.start();
  }, [])

  const [audioContextState, setAudioContextState] = useState(audioCtx.state == "running")

  function handleAudioContextStateChange(ev) {
    setAudioContextState(ev.target.checked);
    if (ev.target.checked) audioCtx.resume();
    else audioCtx.suspend();
  }


  const [osc1Frequency, setOsc1Frequency] = useState(defaultOsc1Frequency);

  // executed every time a state changes
  audioNodes.osc1.frequency.value = osc1Frequency;

  return (
    <>
      <h1>EAD</h1>
      <div>
        <label htmlFor="audioContextState">AudioContext state: {audioContextState}</label>
        <input type="checkbox" id="audioContextState" name="audioContextState"
          checked={audioContextState} onChange={(ev) => handleAudioContextStateChange(ev)} />
        {/* audioCtx.state */ /* WARNING: state is not timely updated in the view */}
      </div>
      <div>
        <input type="range" id="osc1Frequency" name="osc1Frequency" min="220" max="1760" step="1" value={osc1Frequency}
          onChange={(ev) => setOsc1Frequency(ev.target.value)} />
        <label htmlFor="osc1Frequency"> osc1Frequency: {osc1Frequency} </label>
      </div>
    </>
  )
}

export default App
