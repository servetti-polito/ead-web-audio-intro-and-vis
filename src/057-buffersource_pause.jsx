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


  const [audioNodes, setAudioNodes] = useState({});
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [sourceState, setSourceState] = useState({ isPlaying: false, startTime: null, playbackTime: 0 })

  useEffect( () => {
    const update = async() => {
      const buffer = await fetchAudioBuffer("/media/viper.mp3");
      setAudioBuffer(buffer);
    }
    update();
  }, [])


  function play() {
    if(sourceState.isPlaying) return;
    const bufferSrc = new AudioBufferSourceNode(audioCtx);
    bufferSrc.buffer = audioBuffer;
    bufferSrc.connect(audioCtx.destination);
    bufferSrc.start(0, sourceState.playbackTime);
    setAudioNodes((audioNodes) => ({...audioNodes, bufferSrc}) ); // updateAudioNodes
    setSourceState( (sourceState) => ({...sourceState, isPlaying: true, startTime: Date.now() }))
  }

  function pause() {
    if(!sourceState.isPlaying) return;
    function deltaTime(startTime) {
      return (Date.now() - startTime)/1000
    }
    audioNodes.bufferSrc.disconnect(audioCtx.destination);
    setAudioNodes((audioNodes) => ({...audioNodes, bufferSrc: null}) ); // updateAudioNodes
    setSourceState( (sourceState) => ({...sourceState, isPlaying: false, 
      playbackTime: sourceState.playbackTime + deltaTime(sourceState.startTime) 
    }) );
  }




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

  console.log('sourceState', sourceState)

  return (
    <>
      {audioContextCheckboxJSX()}
      {bufferSrcCheckboxJSX()}
      <button onClick={play}>Play</button><button onClick={pause}>pause</button>
    </>
  )

}

export default App
