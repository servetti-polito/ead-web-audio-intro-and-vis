import { useState, useEffect } from 'react';
import { AudioContextComponent, OneTimeButton } from './Tools.jsx'
import { AudioAnalyser }  from './AudioAnalyser.jsx'

const audioCtx = new AudioContext();

await audioCtx.audioWorklet.addModule('/worklets/noise-source-processor.js') 

function App() {

  const [audioNodes, setAudioNodes] = useState(null)

  useEffect(() => {
    const update = async () => {

      const customNode = new AudioWorkletNode(audioCtx, 'NoiseSourceProcessor', {} );
      const analyser = new AnalyserNode(audioCtx);

      // connect
      customNode.connect(analyser).connect(audioCtx.destination);
      // audioNodes.bufferSrc.start();

      setAudioNodes((audioNodes) => ({ ...audioNodes, customNode , analyser }))
    }
    update();
  }, [])


  // we could use radio buttons to synth other frequencies in the buffer
  // new freq sill start when the buffer is re-read for the next loop


  return (
    <>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <OneTimeButton handleClick={() => audioCtx.resume()}>Start NoiseSourceProcessor</OneTimeButton>
      <p></p>
      <AudioAnalyser analyser={audioNodes?.analyser} sampleRate={audioCtx?.sampleRate}/>
    </>
  )

}

export default App
