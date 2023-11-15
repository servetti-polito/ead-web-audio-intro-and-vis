/* eslint-disable react/prop-types */

import {useState} from 'react';
import './App.css';
import {AudioContextComponent, Slider, ToggleTextButton} from './Tools.jsx'
import {AudioAnalyser} from "./AudioAnalyser.jsx";

const audioCtx = new AudioContext();

function App() {

    const defaultOscFrequency = 440;
    const defaultFilterFrequency = 1000;
    const defaultQValue = 25;
    const [audioNodes, setAudioNodes] = useState({});
    const [oscFrequency, setOscFrequency] = useState(defaultOscFrequency);
    const [filterFrequency, setFilterFrequency] = useState(defaultFilterFrequency);

    function start() {
        const analyser = new AnalyserNode(audioCtx);
        // envelope node to control the decreasing of sound

        const osc = new OscillatorNode(audioCtx, {frequency: oscFrequency });
        osc.type = "square";
        osc.start();

        const filter = new BiquadFilterNode(audioCtx);
        filter.type = "lowpass";
        filter.frequency.value = filterFrequency;
        filter.Q.value = defaultQValue;

        osc.connect(filter);
        filter.connect(audioCtx.destination);
        filter.connect(analyser);
        setAudioNodes((audioNodes) => ({...audioNodes, osc, filter, analyser}))
    }

    function stop() {
        audioNodes.osc.disconnect();

        setAudioNodes((audioNodes) => ({...audioNodes, osc: null, filter: null}))
    }


    // executed every time a state changes
    if (audioNodes?.osc) {
        if (audioNodes.osc.frequency.value !== oscFrequency)
            audioNodes.osc.frequency.value = oscFrequency;

        if (audioNodes.filter.frequency.value !== filterFrequency)
            audioNodes.filter.frequency.value = filterFrequency;

    }

    return (
        <>
            <h1>Subtractive Synthesis</h1>
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
            <Slider label={"Filter Frequency"}
            name="filterFrequency" min={0} max={10000} step={100}
            value={filterFrequency}
            handleChange={(ev) => setFilterFrequency(ev.target.value)}
            />
            <p></p>
            <AudioAnalyser analyser={audioNodes?.analyser} sampleRate={audioCtx?.sampleRate}/>
        </>
    )
}


export default App
