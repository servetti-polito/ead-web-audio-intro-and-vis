/* eslint-disable react/prop-types */

import {useState} from 'react';
import './App.css';
import {AudioContextComponent, Slider, ToggleTextButton} from './Tools.jsx'
import {AudioAnalyser} from "./AudioAnalyser.jsx";

const audioCtx = new AudioContext();

function App() {

    const defaultOsc1Frequency = 440;
    const defaultDutyCycle = 0.5;
    const [audioNodes, setAudioNodes] = useState({});
    const [osc1Frequency, setOsc1Frequency] = useState(defaultOsc1Frequency);
    const [osc1DutyCycle, setOsc1DutyCycle] = useState(defaultDutyCycle);

    function gerateTable(refFrequency, amplitude) {
        const maxCoef = audioCtx.sampleRate / (2 * refFrequency); // number of necessary elements
        let a = new Float32Array(audioCtx.sampleRate / 2);
        let b = new Float32Array(audioCtx.sampleRate / 2);
        a[0] = amplitude * osc1DutyCycle; // otherwise a0 = A * d
        b[0] = 0;
        for (let n = 1; n < maxCoef; n++) {
            a[n] = 2 * amplitude * Math.sin(n * Math.PI * osc1DutyCycle) / (n * Math.PI);
            b[n] = 0;
        }
        return {'real': a, 'img': b};
    }

    function start() {
        const osc = new OscillatorNode(audioCtx, {frequency: osc1Frequency});
        osc.connect(audioCtx.destination);

        const fourierConstants = gerateTable(osc1Frequency, 1);
        osc.setPeriodicWave(audioCtx.createPeriodicWave(fourierConstants.real, fourierConstants.img));
        osc.start();
        const analyser = new AnalyserNode(audioCtx);
        osc.connect(analyser);
        setAudioNodes((audioNodes) => ({...audioNodes, osc, analyser}))
    }

    function stop() {
        audioNodes.osc.disconnect();
        setAudioNodes((audioNodes) => ({...audioNodes, osc: null}))
    }


    // executed every time a state changes
    if (audioNodes?.osc) {
        if (audioNodes.osc.frequency.value !== osc1Frequency) {
            audioNodes.osc.frequency.value = osc1Frequency;

            const fourierConstants = gerateTable(osc1Frequency, 1);
            audioNodes.osc.setPeriodicWave(audioCtx.createPeriodicWave(fourierConstants.real, fourierConstants.img));
        }

    }

    return (
        <>
            <h1>Oscillator with frequency slider and type selector</h1>
            <p></p>
            <AudioContextComponent audioCtx={audioCtx}/>
            <p></p>
            <ToggleTextButton handleClick={[start, stop]} text={["Start", "Stop"]}/>
            <p></p>
            <Slider label={"Wave Frequency"}
                    name="osc1Frequency" min={220} max={3520} step={1}
                    value={osc1Frequency}
                    handleChange={(ev) => setOsc1Frequency(ev.target.value)}
            />
            <p></p>
            <Slider label={"Wave Duty Cycle"}
                    name="osc1DutyCycle" min={0} max={1} step={0.005}
                    value={osc1DutyCycle}
                    handleChange={(ev) => setOsc1DutyCycle(ev.target.value)}
            />
            <AudioAnalyser analyser={audioNodes?.analyser} sampleRate={audioCtx?.sampleRate}/>
        </>
    )
}


export default App
