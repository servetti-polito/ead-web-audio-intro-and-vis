/* eslint-disable react/prop-types */
/* samples taken from https://github.com/looshi/wavetable-synth-2 */
import {useState} from 'react';
import './App.css';
import {AudioContextComponent, Select, Slider, ToggleTextButton} from './Tools.jsx'
import * as data from './assets/WaveTableData.json'
import {AudioAnalyser} from "./AudioAnalyser.jsx";

const audioCtx = new AudioContext();

function App() {
    const defaultGainValue = 1;
    const defaultSampleRate = 44100;
    const [audioNodes, setAudioNodes] = useState({});
    const [gainValue, setGainValue] = useState(defaultGainValue);
    const [sampleRate, setSampleRate] = useState(defaultSampleRate);

    function generateWavTable (sr) {
        const buffer = new AudioBuffer({
            numberOfChannels: 2,
            length: data.oboe.length,
            sampleRate: sr
        });
        buffer.copyToChannel(new Float32Array(data.oboe), 0);
        buffer.copyToChannel(new Float32Array(data.oboe), 1);
        const wavSource = new AudioBufferSourceNode(audioCtx);
        wavSource.disconnect();
        wavSource.buffer = buffer;
        wavSource.loop = true;

        return wavSource;
    }
    function start() {
        const analyser = new AnalyserNode(audioCtx);
        const gainNode = new GainNode(audioCtx);
        gainNode.gain.value = gainValue;

        const wavSource = generateWavTable(sampleRate);
        wavSource.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.connect(analyser);
        wavSource.start();
        wavSource._started = true
        setAudioNodes((audioNodes) => ({...audioNodes, wavSource, gainNode, analyser}))
    }

    function stop() {
        audioNodes.wavSource.disconnect();
        setAudioNodes((audioNodes) => ({...audioNodes, wavSource: null, gainNode: null}))
    }


    // executed every time a state changes
    if (audioNodes?.wavSource) {
        if (audioNodes.wavSource.buffer.sampleRate !== sampleRate) {
            audioNodes.wavSource.disconnect();
            audioNodes.wavSource = generateWavTable(sampleRate);
            audioNodes.wavSource.start();
            audioNodes.wavSource.connect(audioNodes.gainNode);
        }
    }

    if (audioNodes?.gainNode) {
        if (audioNodes.gainNode.gain.value !== gainValue) {
            audioNodes.gainNode.gain.value = gainValue;
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
            <Select label={"Sample Rate (without resampling...)"}
                    values={[22050, 44100, 48000, 96000]}
                    selected={defaultSampleRate}
                    handleChange={(ev) => {
                        setSampleRate(ev.target.value);
                    }}/>
            <p></p>
            <Slider label={"Gain"}
                    name="osc1Frequency" min={0} max={5} step={0.1}
                    value={gainValue}
                    handleChange={(ev) => setGainValue(ev.target.value)}
            />
            <p></p>
            <AudioAnalyser analyser={audioNodes?.analyser} sampleRate={audioCtx?.sampleRate}/>
        </>
    )
}


export default App
