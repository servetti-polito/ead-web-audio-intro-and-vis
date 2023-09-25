import { useState, useEffect, useRef } from 'react';

const audioCtx = new AudioContext();
const sr = audioCtx.sampleRate;

async function fetchAudioBuffer(url) {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error("HTTP error, status = " + response.status);
  }
  let arraybuffer = await response.arrayBuffer();
  return await audioCtx.decodeAudioData(arraybuffer);
}


function App() {


  const [audioNodes, setAudioNodes] = useState(null)

  useEffect(() => {
    const update = async () => {
      if (audioNodes == null) {
        setAudioNodes(() => ({
          bufferSrc: new AudioBufferSourceNode(audioCtx)
        }))
        // event handlers ??
      } else {
        // fetch AudioBuffer     
        audioNodes.bufferSrc.buffer = await fetchAudioBuffer("/media/viper.mp3")
        audioNodes.bufferSrc.loop = true;
        // connect
        audioNodes.bufferSrc.connect(audioCtx.destination);
        // audioNodes.bufferSrc.start();
      }
    }
    update();
  }, [audioNodes])


  const [audioContextState, setAudioContextState] = useState(audioCtx.state == "running")
  function handleAudioContextStateChange(ev) {
    setAudioContextState(ev.target.checked);
    if (ev.target.checked) audioCtx.resume();
    else audioCtx.suspend();
  }
  const audioContextCheckboxJSX = () => (
    <div>
      <label htmlFor="audioContextState">AudioContext state: {audioContextState}</label>
      <input type="checkbox" id="audioContextState" name="audioContextState"
        checked={audioContextState} onChange={(ev) => handleAudioContextStateChange(ev)} />
    </div>
  );

  // added oscillator radio button to avoid starting as soon as the page is loaded
  const [bufferSrcState, setBufferSrcState] = useState(false)
  function handlebufferSrcStateChange(ev) {  
    if(ev.target.checked) {
      setBufferSrcState(true);
      audioNodes.bufferSrc.start();
      // setDirty(true);
    }
  }

  const bufferSrcCheckboxJSX = () => (
    <div>
    <label htmlFor="bufferSrcState">Buffer Source state: {bufferSrcState}</label>
    <input type="radio" id="bufferSrcState" name="bufferSrcState" value="" 
      checked={bufferSrcState} onChange={ (ev) => handlebufferSrcStateChange(ev) } />
    </div>
  );


  // we could use radio buttons to synth other frequencies in the buffer
  // new freq sill start when the buffer is re-read for the next loop


  return (
    <>
      {audioContextCheckboxJSX()}
      {bufferSrcCheckboxJSX()}
    </>
  )

}

export default App
