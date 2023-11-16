import { useState, useEffect } from 'react';
import { AudioContextComponent, OneTimeButton, Slider } from './Tools.jsx'
import { AudioAnalyser }  from './AudioAnalyser.jsx'

const audioCtx = new AudioContext();

await audioCtx.audioWorklet.addModule('/worklets/noise-source-processor.js') 

function App() {

  const defaultNoiseSourceGain = 0.5;
  const [audioNodes, setAudioNodes] = useState(null);
  const [noiseSourceGain, setNoiseSourceGain] = useState(defaultNoiseSourceGain);



  useEffect(() => {
    const update = async () => {

      const customNode = new AudioWorkletNode(audioCtx, 'NoiseSourceProcessor', {
        parameterData: { gain: 1 }
      } );
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

  if(audioNodes?.customNode) audioNodes.customNode.parameters.get("gain").value = noiseSourceGain;


  return (
    <>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <OneTimeButton handleClick={() => audioCtx.resume()}>Start NoiseSourceProcessor</OneTimeButton>
      <p></p>  
      <Slider label="Noise Source Gain"
        name="noiseSourceGain" min="0" max="2" step="any" 
        value={noiseSourceGain}
        handleChange={(ev) => setNoiseSourceGain(ev.target.value)}
      />
       <p></p>
      <AudioAnalyser analyser={audioNodes?.analyser} sampleRate={audioCtx?.sampleRate}/>
    </>
  )

}

export default App
