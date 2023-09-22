import { useState, useEffect, useRef } from 'react';

const audioCtx = new AudioContext();

function App() {

  const audioEl = useRef(0);
  // console.log(audioEl.current);

  const [audioNodes, setAudioNodes] = useState({
    audio1: null
  })

  useEffect(() => { 
    if(audioNodes.audio1 != null) {
      console.log('set AudioNodes');
      audioNodes.audio1.connect(audioCtx.destination);
      // audioEl.current.play();
    } else {
      console.log('connect AudioNodes', audioNodes.audio1);
      setAudioNodes( () => ({ audio1: new MediaElementAudioSourceNode(audioCtx, { mediaElement: audioEl.current }) }))
    }
  }, [audioNodes])


  const [audioContextState, setAudioContextState] = useState(audioCtx.state == "running")

  function handleAudioContextStateChange(ev) {
    setAudioContextState(ev.target.checked);
    if (ev.target.checked) audioCtx.resume();
    else audioCtx.suspend();
  }


  const [playing, setPlaying] = useState(false);
  function handlePlayBtnClick() {
    setPlaying(!playing);
    if (playing) audioEl.current.pause();
    else audioEl.current.play();
  }
  
  const [currentTime, setCurrentTime] = useState(0);
  useEffect( () => {
    audioEl.current.addEventListener('timeupdate', () => {
      // console.log(audioEl.current.currentTime)
      setCurrentTime(audioEl.current.currentTime);
    })
  }, [])

  const audioTagWithButtonJSX = () => (
    <>
      <div> <p>
        <audio id="audio" ref={audioEl} loop controls src="/singing.mp3" style={{ width: "50%" }}> </audio>
      </p> </div>
      <div> <p>
        <button id="play" type="button" onClick={handlePlayBtnClick}>Play/Pause</button>
      </p></div> 
    </>
  );
  
  const audioContextCheckboxJSX = () => (
    <div>
      <label htmlFor="audioContextState">AudioContext state: {audioContextState}</label>
      <input type="checkbox" id="audioContextState" name="audioContextState"
        checked={audioContextState} onChange={(ev) => handleAudioContextStateChange(ev)} />
    </div>
  );

  const currentTimeJSX = () => (
    <div> <p>
    <span>CurrentTime: {currentTime}</span>
    </p> </div>
  );


  return (
    <>
      {audioContextCheckboxJSX()}
      {audioTagWithButtonJSX()}
      {currentTimeJSX()}
    </>
  )

  /*
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
      </div>
      <div>
        <input type="range" id="osc1Frequency" name="osc1Frequency" min="220" max="1760" step="1" value={osc1Frequency}
          onChange={(ev) => setOsc1Frequency(ev.target.value)} />
        <label htmlFor="osc1Frequency"> osc1Frequency: {osc1Frequency} </label>
      </div>
    </>
  )
  */
}

export default App
