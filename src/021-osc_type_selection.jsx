/* eslint-disable react/prop-types */

import {useState} from 'react';
import './App.css';
import {AudioContextComponent, Slider, ToggleTextButton, Select} from './Tools.jsx'

const audioCtx = new AudioContext();

function App() {

    const defaultOsc1Frequency = 440;
    const defaultOsc1Type = "square";

    const [audioNodes, setAudioNodes] = useState({});
    const [osc1Frequency, setOsc1Frequency] = useState(defaultOsc1Frequency);
    const [osc1Type, setOsc1Type] = useState(defaultOsc1Type);

    function start() {
        const osc = new OscillatorNode(audioCtx, {frequency: osc1Frequency});
        osc.type = osc1Type;
        osc.connect(audioCtx.destination);
        osc.start();
        setAudioNodes((audioNodes) => ({...audioNodes, osc}))
    }

    function stop() {
        audioNodes.osc.disconnect();
        setAudioNodes((audioNodes) => ({...audioNodes, osc: null}))
    }


    // executed every time a state changes
    if (audioNodes?.osc) {
        if (audioNodes.osc.frequency.value !== osc1Frequency)
            audioNodes.osc.frequency.value = osc1Frequency;

        if (audioNodes.osc.type !== osc1Type) {
            audioNodes.osc.type = osc1Type;
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
            <Slider label={"Osc1 Frequency"}
                    name="osc1Frequency" min={220} max={3520} step={1}
                    value={osc1Frequency}
                    handleChange={(ev) => setOsc1Frequency(ev.target.value)}
            />
            <p></p>
            <Select label={"Osc1 Type"}
                    selected={defaultOsc1Type}
                    values={["sine", "square", "sawtooth", "triangle"]}
                    handleChange={(ev) => {
                        setOsc1Type(ev.target.value);
                    }}/>
        </>
    )
}


export default App
