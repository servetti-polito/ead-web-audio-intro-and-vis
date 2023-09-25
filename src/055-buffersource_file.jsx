import { useState, useEffect, useRef } from 'react';
import { AudioContextComponent, OneTimeButton, CheckboxController } from './Tools.jsx'

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
      const bufferSrc = new AudioBufferSourceNode(audioCtx)
      // create and set AudioBuffer
      bufferSrc.buffer = await fetchAudioBuffer("/media/viper.mp3");
      bufferSrc.loop = true;
      // connect
      bufferSrc.connect(audioCtx.destination);
      // audioNodes.bufferSrc.start();

      setAudioNodes((audioNodes) => ({ ...audioNodes, bufferSrc }))
    }
    update();
  }, [])


  // we could use radio buttons to synth other frequencies in the buffer
  // new freq sill start when the buffer is re-read for the next loop


  return (
    <>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <OneTimeButton handleClick={() => audioNodes.bufferSrc.start()}>Start SourceBuffer</OneTimeButton>
    </>
  )

}

export default App
