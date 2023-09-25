import { useState, useEffect, useRef } from 'react';
import { AudioContextComponent, ToggleTextButton } from './Tools.jsx'

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


  console.log('sourceState', sourceState)

  return (
    <>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <ToggleTextButton handleClick={[play,pause]} text={["Play", "Pause"]} />
    </>
  )

}

export default App
