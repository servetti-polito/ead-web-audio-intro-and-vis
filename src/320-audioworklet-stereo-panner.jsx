import { useState, useEffect } from 'react';
import { AudioContextComponent, OneTimeButton, Slider } from './Tools.jsx'
import { AudioAnalyser }  from './AudioAnalyser.jsx'
import './App.css';

const audioCtx = new AudioContext();

await audioCtx.audioWorklet.addModule('/worklets/stereo-panner-processor.js') 

function App() {

  const defaultStereoPannerPan = 0;
  const [audioNodes, setAudioNodes] = useState(null);
  const [stereoPannerPan, setStereoPannerPan] = useState(defaultStereoPannerPan);

  const [signalEnergy, setSignalEnergy] = useState({ enIn: 0, enOut: Array(2).fill(0)});


  useEffect(() => {
    const update = async () => {

      const osc = new OscillatorNode(audioCtx);
      const customNode = new AudioWorkletNode(audioCtx, 'StereoPannerProcessor', {
        parameterData: { pan: 0 },
        // numberOfOutputs: 2,
        outputChannelCount: [ 2 ]
      } );
      const analyser = new AnalyserNode(audioCtx);

      // connect
      osc.connect(customNode).connect(analyser).connect(audioCtx.destination);
      // audioNodes.bufferSrc.start();
      osc.start()

      customNode.port.onmessage = (e) => {
        setSignalEnergy(e.data);
      }

      setAudioNodes((audioNodes) => ({ ...audioNodes, customNode , analyser, osc }))
    }
    update();
  }, [])


  // we could use radio buttons to synth other frequencies in the buffer
  // new freq sill start when the buffer is re-read for the next loop

  if(audioNodes?.customNode) audioNodes.customNode.parameters.get("pan").value = stereoPannerPan;



  return (
    <>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <OneTimeButton handleClick={() => audioCtx.resume()}>Start</OneTimeButton>
      <p></p>  
      <Slider label="Stereo Panner Pan"
        name="stereoPannerPan" min="-1" max="1" step="any" 
        value={stereoPannerPan}
        handleChange={(ev) => setStereoPannerPan(ev.target.value)}
      />
       <p></p>
       <Slider label="Input Energy" value={Math.round( 10*Math.log(signalEnergy.enIn) )} readOnly /><br/>
       <Slider label="Input Energy" value={Math.round( 10*Math.log(signalEnergy.enOut[0]) )} readOnly /><br/>
       <Slider label="Input Energy" value={Math.round( 10*Math.log(signalEnergy.enOut[1]) )} readOnly /><br/>
       <p></p>
      { /* <AudioAnalyser analyser={audioNodes?.analyser} sampleRate={audioCtx?.sampleRate}/> */ }
    </>
  )

}

export default App
