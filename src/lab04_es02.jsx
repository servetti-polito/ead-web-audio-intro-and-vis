/* eslint-disable react/prop-types */

import {useState} from 'react';
import './App.css';
import {AudioContextComponent, Select, Slider, ToggleTextButton} from './Tools.jsx'
import {AudioAnalyser} from "./AudioAnalyser.jsx";
import WAAClock from 'waaclock';

const audioCtx = new AudioContext();
const clock = new WAAClock(audioCtx);
clock.start();
function ADSR(gainNode, startTime, attack, decay, sustain, release) {
    const targetGain = gainNode.gain.value;
    gainNode.gain.value = 0;
    if (startTime !== 0) {
        gainNode.gain.setValueAtTime(0, startTime);
        if (attack !== 0)
            gainNode.gain.linearRampToValueAtTime(targetGain, startTime + attack);
        if (decay !== 0)
            gainNode.gain.linearRampToValueAtTime(0.9 * targetGain, startTime + attack + decay);
        if (release !== 0)
            gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + attack + decay + sustain + release);
    }
    return gainNode;
}

function getSemitonesFromRefFreq(refFreq) {
    let frequencies = Array();

    for (let i = 0; i <= 12; i++) {
        frequencies.push(Math.pow(2, i/12) * refFreq);
    }

    return frequencies;
}

function majorScaleFilterFn (v, index) {
    // select only major scale indexes
    return (index === 0) || (index === 2) || (index === 4) || (index === 5)
        || (index === 7) || (index === 9) || (index === 11) || (index === 12);
}

function App() {
    const defaultNoteFrequency = 440; // A central
    const defaultTone = "A";
    const allTones = getSemitonesFromRefFreq(defaultNoteFrequency);
    const allLabels = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
    const defaultAttackTime = 0.2;
    const defaultReleaseTime = 2;
    const [audioNodes, setAudioNodes] = useState({});
    const [noteFreq, setNoteFrequency] = useState(defaultNoteFrequency);
    const [attackTime, setAttackTime] = useState(defaultAttackTime);
    const [releaseTime, setReleaseTime] = useState(defaultReleaseTime);
    const [analyser, setAnalyzer] = useState(new AnalyserNode(audioCtx));

    function fromToneToFreq(tone) {
        const index = allLabels.findIndex((value) => (value === tone));
        return allTones[index];
    }
    function start() {
        let osc = Array();
        let gains = Array();

        const majorScale = getSemitonesFromRefFreq(noteFreq).filter(majorScaleFilterFn);
        const cTime = audioCtx.currentTime;
        let eTime = 0;

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
        envelope.gain.setValueAtTime(envelope.gain.value, cTime);

        for (let i = 0; i < majorScale.length; i++) {
            // gain node with ADSR of a Piano (attack and release only
            gains.push(
                ADSR(new GainNode(audioCtx, {gain: 1}),
                    cTime + i * (attackTime + releaseTime),
                    attackTime, 0, 0, releaseTime)
            );

            osc.push(new OscillatorNode(audioCtx, {frequency: majorScale[i]}));

            osc[i].connect(gains[i]);
            gains[i].connect(envelope);
            // accumulate time to know when they will finish
            eTime += cTime + attackTime + releaseTime;
        }

        envelope.connect(analyser);

        for (let i = 0; i < majorScale.length; i++) {
            osc[i].start();
        }

        const event = reschedule(eTime, start);
        setAudioNodes((audioNodes) => ({...audioNodes, osc, gains, envelope, event}));
    }

    function reschedule(when, fn) {
        return clock.callbackAtTime(fn, when);
    }

    function stop() {
        for (let i = 0; i < audioNodes.osc.length; i++) {
            audioNodes.osc[i].disconnect();
        }

        audioNodes.event.clear();
        setAudioNodes((audioNodes) => ({...audioNodes, osc: null, gains: null}))
    }


    // executed every time a state changes
    if (audioNodes?.osc) {
         if (audioNodes.osc[0].frequency.value !== noteFreq) {
             const majorScale = getSemitonesFromRefFreq(noteFreq).filter(majorScaleFilterFn);
             for (let i = 0; i < majorScale.length; i++) {
                  audioNodes.osc[i].frequency.value = majorScale[i];
            }
         }
    }

    return (
        <>
            <h1>Lab 04 - es 02</h1>
            <p></p>
            <AudioContextComponent audioCtx={audioCtx}/>
            <p></p>
            <ToggleTextButton handleClick={[start, stop]} text={["Start", "Stop"]}/>
            <p></p>
            <Slider label={"Attack Time"}
                    name="attackTime" min={0.1} max={2} step={0.1}
                    value={attackTime}
                    handleChange={(ev) => setAttackTime(ev.target.value)}
            />
            <p></p>
            <Slider label={"Release Time"}
                    name="releaseTime" min={0.1} max={5} step={0.1}
                    value={releaseTime}
                    handleChange={(ev) => setReleaseTime(ev.target.value)}
            />
            <p></p>
            <Select label={"Note"}
                    selected={defaultTone}
                    values={allLabels}
                    handleChange={(ev) => {
                        setNoteFrequency(fromToneToFreq(ev.target.value));
                    }}/>
            <p></p>
            <AudioAnalyser analyser={analyser} sampleRate={audioCtx?.sampleRate}/>
        </>
    )
}


export default App
