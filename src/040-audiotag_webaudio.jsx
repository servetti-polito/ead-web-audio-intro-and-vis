import { useState, useEffect, useRef } from 'react';


async function fetchAudioBuffer(url) {
  let response = await fetch(url);
  let arraybuffer = await response.arrayBuffer();
  return await audioCtx.decodeAudioData(arraybuffer);
}

const audioCtx = new AudioContext();

function App() {

  const audioEl = useRef(0);
  // console.log(audioEl.current);

  const [audioNodes, setAudioNodes] = useState(null)

  useEffect(() => {
    const update = async () => {
      if (audioNodes == null) {
        console.log('set AudioNodes');
        const impulseResponse = await fetchAudioBuffer('/media/1a_marble_hall.wav');
        setAudioNodes(() => ({
          audio1: new MediaElementAudioSourceNode(audioCtx, { mediaElement: audioEl.current }),
          convolver1: new ConvolverNode(audioCtx, { buffer:  impulseResponse }),
          gain1: new GainNode(audioCtx, { gain: 0.5 } )
        }))
      } else {
        console.log('connect AudioNodes', audioNodes.audio1);
        audioNodes.audio1.connect(audioNodes.convolver1).connect(audioNodes.gain1).connect(audioCtx.destination);
        // audioEl.current.play();
      }
    }
    update();
  }, [audioNodes])


  const [audioContextState, setAudioContextState] = useState(audioCtx.state == "running")
  function handleAudioContextStateChange(ev) {
    setAudioContextState(ev.target.checked);
    if (ev.target.checked) audioCtx.resume();
    else audioCtx.suspend();
  }
  const audioContextCheckboxJSX = () => (
    <div>
      <label htmlFor="audioContextState">AudioContext state: {audioContextState}</label>
      <input type="checkbox" id="audioContextState" name="audioContextState"
        checked={audioContextState} onChange={(ev) => handleAudioContextStateChange(ev)} />
    </div>
  );

  const [playing, setPlaying] = useState(false);
  function handlePlayBtnClick() {
    setPlaying(!playing);
    if (playing) audioEl.current.pause();
    else audioEl.current.play();
  }
  const audioTagWithButtonJSX = () => (
    <>
      <div> <p>
        <audio id="audio" ref={audioEl} loop  src="/media/singing.mp3" style={{ width: "50%" }}> </audio>
      </p> </div>
      <div> <p>
        <button id="play" type="button" onClick={handlePlayBtnClick}>Play/Pause</button>
      </p></div>
    </>
  );



  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    audioEl.current.addEventListener('timeupdate', () => {
      // console.log(audioEl.current.currentTime)
      setCurrentTime(audioEl.current.currentTime);
    })
  }, [])
  const currentTimeJSX = () => (
    <div> <p>
      <span>CurrentTime: {currentTime}</span>
    </p> </div>
  );

  const [convolverState, setConvolverState] = useState(true);
  function handleConvolverStateChange(ev) {
    setConvolverState(ev.target.checked);
    if (ev.target.checked) {
      audioNodes.audio1.disconnect();
      audioNodes.audio1.connect(audioNodes.convolver1).connect(audioNodes.gain1).connect(audioCtx.destination);
    } else {
      // skip convolver
      audioNodes.convolver1.disconnect(); audioNodes.audio1.disconnect();
      audioNodes.audio1.connect(audioCtx.destination);
    }
  }
  const convolverCheckboxJSX = () => (
    <div>
      <label htmlFor="convolverState">Convolver state: {audioContextState}</label>
      <input type="checkbox" id="convolverState" name="convolverState"
        checked={convolverState} onChange={handleConvolverStateChange} />
    </div>
  );


  return (
    <>
      {audioContextCheckboxJSX()}
      {audioTagWithButtonJSX()}
      {currentTimeJSX()}
      {convolverCheckboxJSX()}
    </>
  )

}

export default App
