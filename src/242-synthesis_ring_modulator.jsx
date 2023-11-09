/* eslint-disable react/prop-types */

import {useState} from 'react';
import './App.css';
import {AudioContextComponent, Slider, ToggleTextButton} from './Tools.jsx'
import {AudioAnalyser} from "./AudioAnalyser.jsx";

const audioCtx = new AudioContext();

function App() {

    const defaultOscFrequency = 440;
    const defaultModulatorFrequency = 100;
    const [audioNodes, setAudioNodes] = useState({});
    const [oscFrequency, setOscFrequency] = useState(defaultOscFrequency);
    const [modFrequency, setModFrequency] = useState(defaultModulatorFrequency);

    function start() {
        const osc = new OscillatorNode(audioCtx, {frequency: oscFrequency});
        const modulator = new OscillatorNode(audioCtx, {frequency: modFrequency});
        const analyser = new AnalyserNode(audioCtx);
        const gain = new GainNode(audioCtx);
        gain.gain.value = 1;
        osc.start();
        osc.connect(gain);

        modulator.start();
        modulator.connect(gain.gain);

        gain.connect(audioCtx.destination);
        gain.connect(analyser);
        setAudioNodes((audioNodes) => ({...audioNodes, osc, modulator, gain, analyser}))
    }

    function stop() {
        audioNodes.osc.disconnect();
        audioNodes.modulator.disconnect();
        setAudioNodes((audioNodes) => ({...audioNodes, osc: null, modulator: null}))
    }


    // executed every time a state changes
    if (audioNodes?.osc) {
        if (audioNodes.osc.frequency.value !== oscFrequency)
            audioNodes.osc.frequency.value = oscFrequency;
        if (audioNodes.modulator.frequency.value !== modFrequency)
            audioNodes.modulator.frequency.value = modFrequency;
    }

    return (
        <>
            <h1>Oscillator with frequency slider</h1>
            <p></p>
            <AudioContextComponent audioCtx={audioCtx}/>
            <p></p>
            <ToggleTextButton handleClick={[start, stop]} text={["Start", "Stop"]}/>
            <p></p>
            <Slider label={"Osc Frequency"}
                    name="oscFrequency" min={220} max={3520} step={1}
                    value={oscFrequency}
                    handleChange={(ev) => setOscFrequency(ev.target.value)}
            />
            <p></p>
            <Slider label={"Modulator Frequency"}
                    name="modFrequency" min={20} max={3520} step={1}
                    value={modFrequency}
                    handleChange={(ev) => setModFrequency(ev.target.value)}
            />
            <p></p>
            <AudioAnalyser analyser={audioNodes?.analyser} sampleRate={audioCtx?.sampleRate}/>
        </>
    )
}


export default App
