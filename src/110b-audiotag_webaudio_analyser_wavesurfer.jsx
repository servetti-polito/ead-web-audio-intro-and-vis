/* eslint-disable react/prop-types */

import { useState,useMemo ,useEffect,useCallback ,useRef } from 'react';
import { AudioContextComponent, ToggleTextButton, CheckboxController } from './Tools.jsx'
import * as React from 'react'
import { useWavesurfer } from '@wavesurfer/react'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'

async function fetchAudioBuffer(url) {
  let response = await fetch(url);
  let arraybuffer = await response.arrayBuffer();
  return await audioCtx.decodeAudioData(arraybuffer);
}

const audioCtx = new AudioContext();
const formatTime = (seconds) => [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')

function App() {

  const audioEl = useRef(0);
  const audioEl2 = useRef(1);
  const [audioNodes, setAudioNodes] = useState(null)

  const defaultConvolverState = true;
  let state=true
  function connectWithConvolver(flag) {
    if (flag) {
      audioNodes.audio.connect(audioNodes.convolver)       // connect
        .connect(audioNodes.gain)
        .connect(audioNodes.dummyOut);
      audioNodes.audio.connect(audioNodes.dummyOut);     // to avoid error the first time                
      audioNodes.audio.disconnect(audioNodes.dummyOut);  // disconnect 
    } else {
      audioNodes.audio.connect(audioNodes.dummyOut);       // connect
      audioNodes.audio.connect(audioNodes.convolver);      // to avoid error the first time 
      audioNodes.audio.disconnect(audioNodes.convolver);   // disconnect
      audioNodes.convolver.disconnect(); // avoid convolver memory "flush"
    }
  }

  const { wavesurfer, currentTime } = useWavesurfer({
    container: audioEl2,
    height: 100,
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    // url: '/media/singing.mp3',
    media: audioEl.current,
    plugins: useMemo(() => [Timeline.create()], []),
  })

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause()
  }, [wavesurfer])

  useEffect(() => {
    const update = async () => {
      const impulseResponse = await fetchAudioBuffer('/media/1a_marble_hall.wav');
      const audio = new MediaElementAudioSourceNode(audioCtx, { mediaElement: audioEl.current });
      const convolver = new ConvolverNode(audioCtx, { buffer: impulseResponse });
      const gain = new GainNode(audioCtx, { gain: 0.5 });
      const dummyOut = new GainNode(audioCtx);
      const analyser = new AnalyserNode(audioCtx);
      dummyOut.connect(audioCtx.destination);
      dummyOut.connect(analyser);
      // connectWithConvolver(true)

      /*
      audio.connect(convolver)                // connect
        .connect(gain)
        .connect(dummyOut);
      audio.connect(dummyOut);     // to avoid error the first time                
      audio.disconnect(dummyOut);  // disconnect 
      */

      setAudioNodes((audioNodes) => ({...audioNodes, audioCtx, audio, convolver, gain, dummyOut, analyser }));
      // setInterval(() => draw(), 100); // uses requestAnimationFrame
      
    }
    update();
  }, [])


  useEffect( () => {
    if(audioNodes) {
      connectWithConvolver(defaultConvolverState);
      // draw()
    }
  }, [audioNodes])


  
  return (
    <>
      <p></p>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <audio id="audio" ref={audioEl} loop src="/media/singing.mp3" style={{ width: "50%" }}> </audio>
      <p></p>
      <ToggleTextButton handleClick={[() => {audioCtx.resume(); audioEl.current.play()}, () => audioEl.current.pause()]}
        text={["Play", "Pause"]} />
      <p></p>
      <p>Current time: {formatTime(currentTime)}</p>
      { /* <span>CurrentTime: {currentTime}</span> */ }
      <p></p>
      {/*<CheckboxController init={defaultConvolverState} textLabel={"Convolver state"} handleChange={connectWithConvolver} />*/}
      <div ref={audioEl2} />
    </>
  )

}

export default App;
