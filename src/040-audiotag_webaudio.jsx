import { useState, useEffect, useRef } from 'react';
import { AudioContextComponent, ToggleTextButton, CheckboxController  } from './Tools.jsx'


async function fetchAudioBuffer(url) {
  let response = await fetch(url);
  let arraybuffer = await response.arrayBuffer();
  return await audioCtx.decodeAudioData(arraybuffer);
}

const audioCtx = new AudioContext();

function App() {

  const audioEl = useRef(0);

  const [audioNodes, setAudioNodes] = useState({})

  useEffect(() => {
    const update = async () => {
        const impulseResponse = await fetchAudioBuffer('/media/1a_marble_hall.wav');
        const audio = new MediaElementAudioSourceNode(audioCtx, { mediaElement: audioEl.current });
        const convolver = new ConvolverNode(audioCtx, { buffer:  impulseResponse });
        const gain = new GainNode(audioCtx, { gain: 0.5 } );
        audio.connect(convolver).connect(gain).connect(audioCtx.destination);
        setAudioNodes((audioNodes) => ({...audioNodes, audio, convolver, gain}))
    }
    update();
  }, [])


  function handleConvolverStateChange(checked) {
    if (checked) {
      audioNodes.audio.disconnect();
      audioNodes.audio.connect(audioNodes.convolver).connect(audioNodes.gain).connect(audioCtx.destination);
    } else {
      // skip convolver
      audioNodes.convolver.disconnect(); audioNodes.audio.disconnect();
      audioNodes.audio.connect(audioCtx.destination);
    }
  }


  return (
    <>
      <p></p>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <audio id="audio" ref={audioEl} loop  src="/media/singing.mp3" style={{ width: "50%" }}> </audio>
      <p></p>
      <ToggleTextButton handleClick={[ () => audioEl.current.play(), () => audioEl.current.pause() ]}
        text={["Play", "Pause"]} />
      <p></p>
      <CurrentTime audioEl={audioEl} /> 
      <p></p>
      <CheckboxController init={true} textLabel={"Convolver state"} handleChange={handleConvolverStateChange}/>
    </>
  )

}

const CurrentTime = (props) => {
  const audioEl = props.audioEl;
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    audioEl.current.addEventListener('timeupdate', () => {
      setCurrentTime(audioEl.current.currentTime);
    })
  }, [])

  return (
    <div>
      Current time: {currentTime}
    </div>
  )
}


export default App
