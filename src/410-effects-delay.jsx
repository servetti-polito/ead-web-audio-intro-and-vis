import { useState, useEffect, useRef } from 'react';
import { AudioContextComponent, ToggleTextButton, Slider } from './Tools.jsx'


const audioCtx = new AudioContext();

function App() {

  const audioEl = useRef(0);

  const [audioNodes, setAudioNodes] = useState({})

  const defaultFeedbackGainVal = 0.5;
  const [feedbackGainVal, setFeedbackGainVal] = useState(defaultFeedbackGainVal)

  const defaultDelayVal = 20;
  const [delayVal, setDelayVal] = useState(defaultDelayVal)

  const defaultDepthVal = 0;
  const [depthVal, setDepthVal] = useState(defaultDepthVal)


  useEffect(() => {
    const update = async () => {
      const audio = new MediaElementAudioSourceNode(audioCtx, { mediaElement: audioEl.current });
      const dryGain = new GainNode(audioCtx, { gain: 1-defaultDepthVal });
      const wetGain = new GainNode(audioCtx, { gain: defaultDepthVal });
      // read gain value from slider
      const feedbackGain = new GainNode(audioCtx, { gain: defaultFeedbackGainVal });
      // const gain = new GainNode(audioCtx, { gain: 0.5 });

      // [DRY signal path]
      audio.connect(dryGain).connect(audioCtx.destination);

      // [WET signal path]
      // read delay time from slider
      const delay = new DelayNode(audioCtx, { delayTime: defaultDelayVal / 1000 });
      // DELAY line
      audio.connect(delay).connect(wetGain).connect(audioCtx.destination);
      // FEEDBACK line with GAIN
      delay.connect(feedbackGain).connect(delay);

      setAudioNodes((audioNodes) => ({ ...audioNodes, audio, dryGain, wetGain, feedbackGain, delay }))
    }
    update();
  }, [])

  function db2amp(db) { 
    return db > -100 ? Math.pow(10,db/20) : 0
  }
  function amp2db(amp) { 
    return amp > 0 ? 20*Math.log10(amp) : -Infinity
  }

  if(audioNodes.delay) audioNodes.delay.delayTime.value = delayVal / 1000;
  if(audioNodes.feedbackGain) audioNodes.feedbackGain.gain.value = feedbackGainVal;
  if(audioNodes.dryGain && audioNodes.dryGain) {
    audioNodes.wetGain.gain.value = depthVal;
    audioNodes.dryGain.gain.value = 1-depthVal;
  }

  return (
    <>
      <p></p>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <audio id="audio" ref={audioEl} loop src="/media/sample_for_chorus.wav" style={{ width: "50%" }}> </audio>
      <p></p>
      <ToggleTextButton handleClick={[() => audioEl.current.play(), () => audioEl.current.pause()]}
        text={["Play", "Pause"]} />
      <p></p>
      <CurrentTime audioEl={audioEl} />
      <p></p>
      <Slider label={"Depth (wet)"}
        name="delayVal" min={0} max={1} step="any"
        value={depthVal}
        handleChange={(ev) => setDepthVal(ev.target.value)}
      />
      <p></p>
      <Slider label={"Delay (ms)"}
        name="delayVal" min={0} max={300} step="any"
        value={delayVal}
        handleChange={(ev) => setDelayVal(ev.target.value)}
      />
      <p></p>
      {/*
      <Slider label={"Feedback gain"}
        name="feedbackGainVal" min={-100} max={0} step="any"
        value={amp2db(feedbackGainVal)}
        handleChange={(ev) => setFeedbackGainVal(db2amp(ev.target.value))}
      />
      */}
      <Slider label={"Feedback gain"}
        name="feedbackGainVal" min={0} max={1} step="any"
        value={feedbackGainVal}
        handleChange={(ev) => setFeedbackGainVal(ev.target.value)}
      />
      <p></p>
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
