/* eslint-disable react/prop-types */

import {useState} from 'react';
import './App.css';
import {AudioContextComponent, Slider, ToggleTextButton} from './Tools.jsx'
import {AudioAnalyser} from "./AudioAnalyser.jsx";
import WAAClock from 'waaclock';

const audioCtx = new AudioContext();
const clock = new WAAClock(audioCtx);
clock.start();
function App() {
    const defaultOsc1Frequency = 440;
    const oscFreq = [
        1,
        2,
        2.4,
        3,
        4.5,
        5.33,
        6
    ]

    const [audioNodes, setAudioNodes] = useState({});
    const [osc1Frequency, setOsc1Frequency] = useState(defaultOsc1Frequency);
    const [analyser, setAnalyzer] = useState(new AnalyserNode(audioCtx));

    function start() {
        let osc = Array();
        let gains = Array();

        const cTime = audioCtx.currentTime;
        const rateDecrease = 1;
        const eTime = cTime + 5*rateDecrease;

        if (audioNodes?.osc) {
            for (let i = 0; i < audioNodes.osc.length; i++) {
                audioNodes.osc[i].disconnect();
                audioNodes.gains[i] = null;
             }
            audioNodes.osc = null;
            audioNodes.gains = null;
            audioNodes.envelope = null;
        }

        // envelope node to control the decreasing of sound
        const envelope = new GainNode(audioCtx);

        envelope.connect(audioCtx.destination);
        envelope.gain.value = 1;
        envelope.gain.setValueAtTime(envelope.gain.value, audioCtx.currentTime);

        for (let i = 0; i < oscFreq.length; i++) {
            // gain node to avoid clipping (and adding same portion of wave)
            gains.push(new GainNode(audioCtx));
            gains[i].gain.value = 1/oscFreq.length;
            osc.push(new OscillatorNode(audioCtx, {frequency: osc1Frequency * oscFreq[i]}));

            osc[i].connect(gains[i]);
            gains[i].connect(envelope);
        }
        // decrease starts 2 seconds after
        envelope.gain.setTargetAtTime(0, cTime, rateDecrease);
        envelope.connect(analyser);

        for (let i = 0; i < oscFreq.length; i++) {
            osc[i].start(cTime);
        }

        const event = reschedule(eTime, start);
        setAudioNodes((audioNodes) => ({...audioNodes, osc, gains, event}))
    }

    function reschedule(when, fn) {
        return clock.callbackAtTime(fn, when);
    }

    function stop() {
        for (let i = 0; i < audioNodes.osc.length; i++) {
            audioNodes.osc[i].disconnect();
        }
        clock.stop();
        audioNodes.event.cancel();
        setAudioNodes((audioNodes) => ({...audioNodes, osc: null, gains: null}))
    }


    // executed every time a state changes
    if (audioNodes?.osc) {
         if (audioNodes.osc[0].frequency.value !== osc1Frequency) {
             for (let i = 0; i < oscFreq.length; i++) {
                  audioNodes.osc[i].frequency.value = osc1Frequency * oscFreq[i];
            }
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
            <AudioAnalyser analyser={analyser} sampleRate={audioCtx?.sampleRate}/>
        </>
    )
}


export default App
