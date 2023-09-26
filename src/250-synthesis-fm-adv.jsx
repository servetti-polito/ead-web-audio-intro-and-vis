/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import './App.css';
import { AudioContextComponent, OneTimeButton, Slider, ToggleTextButton } from './Tools.jsx'
import { AudioAnalyser } from './AudioAnalyser.jsx'

const audioCtx = new AudioContext();

function getModulatorFrequency(carrierFrequency, harmonicityRatio) {
  return carrierFrequency * harmonicityRatio;
}

function getModulatorGain(modulatorFrequency, modulationIndex) {
  return modulatorFrequency * modulationIndex;
}

function dbToAmp(db) {
  return Math.pow(10, db / 20);
}

function App() {

  const defaultCarrierFrequency = 220; // C
  const defaultCarrierGainDB = -3;
  const defaultHarmonicityRatio = 1 / 1; // M/C
  const defaultModulationIndex = 0;
  const defaultFFTSize = 4096;

  const [audioNodes, setAudioNodes] = useState({})
  const [audioControls, setAudioControls] = useState({
    carrierFrequency: defaultCarrierFrequency,
    harmonicityRatio: defaultHarmonicityRatio,
    modulationIndex: defaultModulationIndex
  });

  function start() {
    const carrierOscNode = new OscillatorNode(audioCtx,
      { frequency: audioControls.carrierFrequency });
    const carrierGainNode = new GainNode(audioCtx,
      { gain: dbToAmp(defaultCarrierGainDB) }); // fixed
    const modulatorOscNode = new OscillatorNode(audioCtx,
      { frequency: getModulatorFrequency(audioControls.carrierFrequency, audioControls.harmonicityRatio) })
    const modulatorGainNode = new GainNode(audioCtx,
      {
        gain: getModulatorGain(
          getModulatorFrequency(audioControls.carrierFrequency, audioControls.harmonicityRatio),
          audioControls.modulationIndex)
      });
    const analyserNode = new AnalyserNode(audioCtx, { fftSize: defaultFFTSize });

    // connections
    modulatorOscNode
      .connect(modulatorGainNode)
      .connect(carrierOscNode.frequency)  // IMPORTANT: it ADDS to the internal frequency value !!
    carrierOscNode.connect(carrierGainNode).connect(audioCtx.destination);
    carrierGainNode.connect(analyserNode);
    modulatorOscNode.start();
    carrierOscNode.start();

    setAudioNodes((audioNodes) => ({ ...audioNodes, carrierOscNode, carrierGainNode, modulatorOscNode, modulatorGainNode, analyserNode }))
  }

  /*
  function stop() {
    audioNodes.osc.disconnect();
    setAudioNodes( (audioNodes) => ({...audioNodes, osc: null}))
  }
  */

  const modulatorFrequency = getModulatorFrequency(
    audioControls.carrierFrequency, audioControls.harmonicityRatio
  );
  const modulatorGain = getModulatorGain(
    getModulatorFrequency(audioControls.carrierFrequency, audioControls.harmonicityRatio),
    audioControls.modulationIndex
  );

  if (audioNodes.carrierOscNode) {
    audioNodes.carrierOscNode.frequency.value = audioControls.carrierFrequency;
    audioNodes.modulatorOscNode.frequency.value = modulatorFrequency;
    audioNodes.modulatorGainNode.gain.value = modulatorGain;
  }

  return (
    <>
      <h1>FM Synthesis - Controlled by Fc, M:C, I</h1>
      <p></p>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <div>modulatorGainNode gain: {modulatorGain}</div>
      <div>modulatorOscNode freq: {modulatorFrequency}</div>
      <p></p>
      <OneTimeButton handleClick={start}>Start</OneTimeButton>
      <p></p>
      <Slider label={"Carrier Frequency"} 
        name="carrierOscFrequency" min={220} max={3520} step={1} 
        value={audioControls.carrierFrequency}
        handleChange={(ev) => setAudioControls((audioControls) =>
          ({ ...audioControls, carrierFrequency: ev.target.value }))
        } />
      <Slider label={"Harmonicity Ratio"} 
        name="harmonicityRatio" min={0} max={5} step={0.05} 
        value={audioControls.harmonicityRatio}
        handleChange={(ev) => setAudioControls((audioControls) =>
          ({ ...audioControls, harmonicityRatio: ev.target.value }))
        } />
      <Slider label={"Modulation Index"} 
        name="modulationIndex" min={0} max={10} step={0.1} 
        value={audioControls.modulationIndex}
        handleChange={(ev) => setAudioControls((audioControls) =>
          ({ ...audioControls, modulationIndex: ev.target.value }))
        } />
      <p></p>
      <AudioAnalyser analyser={audioNodes?.analyserNode} sampleRate={audioCtx?.sampleRate} />
    </>
  )
}



export default App
