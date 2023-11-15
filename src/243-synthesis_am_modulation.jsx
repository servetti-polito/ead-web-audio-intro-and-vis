/* eslint-disable react/prop-types */

import {useState} from 'react';
import './App.css';
import {AudioContextComponent, Slider, ToggleTextButton} from './Tools.jsx'
import {AudioAnalyser} from "./AudioAnalyser.jsx";

const audioCtx = new AudioContext();

function App() {
    const defaultOscFrequency = 440;
    const defaultKValue = 0.5;
    const defaultModulatorFrequency = defaultKValue * defaultOscFrequency;
    const defaultModulatorGain = 1;
    const defaultAmpValue = 1;
    const [audioNodes, setAudioNodes] = useState({});
    const [oscFrequency, setOscFrequency] = useState(defaultOscFrequency);
    const [ampValue, setAmpValue] = useState(defaultAmpValue);
    const [modFrequency, setModFrequency] = useState(defaultModulatorFrequency);
    const [modAmp, setModAmp] = useState(defaultModulatorGain);


    function start() {
        const osc = new OscillatorNode(audioCtx, {frequency: oscFrequency});
        osc.start();
        const modulator = new OscillatorNode(audioCtx, {frequency: modFrequency});
        modulator.type = "square";
        modulator.start();
        const analyser = new AnalyserNode(audioCtx);
        // modulator gain -> to connect with modulator Oscillator
        const modGain = new GainNode(audioCtx);
        modGain.gain.value = modAmp;
        // constant gain of the modulation
        const constantGain = new GainNode(audioCtx);
        constantGain.gain.value = ampValue;

        const outputGain = new GainNode(audioCtx);
        outputGain.gain.value = 1;
        // OSC -> GAIN
        osc.connect(constantGain);
        // OSC -> GAIN -> OUTPUT
        constantGain.connect(outputGain);
        // MODULATOR -> GAIN
        modulator.connect(modGain);
        // MODULATOR -> GAIN -> OUTPUT GAIN
        modGain.connect(outputGain.gain);

        outputGain.connect(audioCtx.destination);
        outputGain.connect(analyser);

        setAudioNodes((audioNodes) => ({...audioNodes, osc, modulator, modGain, constantGain, analyser}))
    }

    function stop() {
        audioNodes.osc.disconnect();
        audioNodes.modulator.disconnect();
        setAudioNodes((audioNodes) => ({...audioNodes, osc: null, modulator: null}))
    }


    // executed every time a state changes
    if (audioNodes?.osc) {
        if (audioNodes.osc.frequency.value !== oscFrequency) {
            audioNodes.osc.frequency.value = oscFrequency;
            audioNodes.modulator.frequency.value = defaultKValue * oscFrequency;
        }


        /*if (audioNodes.modulator.frequency.value !== modFrequency)
            audioNodes.modulator.frequency.value = modFrequency;*/

        if (audioNodes.constantGain.gain.value !== ampValue)
            audioNodes.constantGain.gain.value = ampValue;

        if (audioNodes.modGain.gain.value !== modAmp)
            audioNodes.modGain.gain.value = modAmp;
    }

    return (
        <>
            <h1>Synthesis AM</h1>
            <p></p>
            <AudioContextComponent audioCtx={audioCtx}/>
            <p></p>
            <ToggleTextButton handleClick={[start, stop]} text={["Start", "Stop"]}/>
            <p></p>
            <Slider label={"Osc Frequency"}
                    name="oscFrequency" min={220} max={3520} step={10}
                    value={oscFrequency}
                    handleChange={(ev) => setOscFrequency(ev.target.value)}
            />
            <p></p>
            <Slider label={"Oscillator Constant Amp"}
                    name="ampValue" min={0.05} max={5} step={0.05}
                    value={ampValue}
                    handleChange={(ev) => setAmpValue(ev.target.value)}
            />
            <p></p>
            <Slider label={"Modulator Frequency"}
                    name="modFrequency" min={0} max={3520} step={10}
                    value={modFrequency}
                    handleChange={(ev) => setModFrequency(ev.target.value)}
            />
            <p></p>
            <Slider label={"Modulator Gain"}
                    name="ampValue" min={0.1} max={1} step={0.05}
                    value={modAmp}
                    handleChange={(ev) => setModAmp(ev.target.value)}
            />
            <p></p>
            <AudioAnalyser analyser={audioNodes?.analyser} sampleRate={audioCtx?.sampleRate}/>
        </>
    )
}


export default App
