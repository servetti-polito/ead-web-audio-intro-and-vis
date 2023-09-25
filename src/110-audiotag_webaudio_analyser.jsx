import { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js/dist/plotly';


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

  function connectWithConvolver(flag) {   
    if(flag) {
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


  useEffect(() => {
    const update = async () => {
      if (audioNodes == null) {
        console.log('set AudioNodes');
        const impulseResponse = await fetchAudioBuffer('/media/1a_marble_hall.wav');
        setAudioNodes(() => ({
          audio: new MediaElementAudioSourceNode(audioCtx, { mediaElement: audioEl.current }),
          convolver: new ConvolverNode(audioCtx, { buffer:  impulseResponse }),
          gain: new GainNode(audioCtx, { gain: 0.5 } ),
          dummyOut: new GainNode(audioCtx),
          analyser: new AnalyserNode(audioCtx)
        }))
      } else {
        console.log('connect AudioNodes', audioNodes.audio);
        audioNodes.dummyOut.connect(audioCtx.destination);
        audioNodes.dummyOut.connect(audioNodes.analyser);
        connectWithConvolver(convolverState);
        setInterval(() => draw(), 100); // uses requestAnimationFrame
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
        <audio id="audio" ref={audioEl} loop controls src="/media/singing.mp3" style={{ width: "50%" }}> </audio>
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
    const flag = ev.target.checked;
    setConvolverState(flag);
    connectWithConvolver(flag);
  }
  const convolverCheckboxJSX = () => (
    <div>
      <label htmlFor="convolverState">Convolver state: {audioContextState}</label>
      <input type="checkbox" id="convolverState" name="convolverState"
        checked={convolverState} onChange={handleConvolverStateChange} />
    </div>
  );


  
  const waveformPlot = useRef(null);
  const spectrumPlot = useRef(null);

  const draw = () => {
    const timeDataArray = new Float32Array(audioNodes.analyser.fftSize);
    audioNodes.analyser.getFloatTimeDomainData(timeDataArray);
    waveformPlotFn(waveformPlot.current, timeDataArray, audioCtx.sampleRate);

    const freqDataArray = new Float32Array(audioNodes.analyser.frequencyBinCount);
    audioNodes.analyser.getFloatFrequencyData(freqDataArray);
    spectrumPlotFn(spectrumPlot.current,freqDataArray, audioCtx.sampleRate);
  };
  
  const analyserPlotJSX = () => ( 
    <>
      <p></p>
      <table style={{ width: "100%" }}><tbody><tr>
        <td style={{ width: "40%" }}><div ref={spectrumPlot} data-active="false"></div></td>
        <td style={{ width: "40%" }}><div ref={waveformPlot} data-active="false"></div></td>
      </tr></tbody></table>
    </>
  );

  return (
    <>
      {audioContextCheckboxJSX()}
      {audioTagWithButtonJSX()}
      {currentTimeJSX()}
      {convolverCheckboxJSX()}
      {analyserPlotJSX()}
    </>
  )

}


function waveformPlotFn(htmlEl, wave, sampleRate) {
  const sr = sampleRate;
  if (htmlEl.dataset.active == 'true') {
    Plotly.animate( htmlEl,
      { data: [{ x: wave.map((v, i) => i / sr), y: wave }] },
      { transition: { duration: 0 }, frame: { duration: 0, redraw: false }, }
    );
  } else {
    Plotly.newPlot( htmlEl,
      [ { x: wave.map((v, i) => i / sr), y: wave } ],
      { margin: { t: 0 },
        xaxis: { title: { text: 'Time (s)' }, automargin: true, range: [0, 0.02] },
        yaxis: { title: { text: 'Amplitude' }, automargin: true, range: [-1, +1] }
      }
    );
  }
  htmlEl.dataset.active = true;
}

function spectrumPlotFn(htmlEl, spectrum, sampleRate) {
  const dF = sampleRate / (2*spectrum.length);
  if (htmlEl.dataset.active == 'true') {
    Plotly.animate( htmlEl,
      { data: [{ x: spectrum.map((v, i) => i * dF), y: spectrum }] },
      { transition: { duration: 0 }, frame: { duration: 0, redraw: false } }
    );
  } else {
    Plotly.newPlot( htmlEl,
      [ { x: spectrum.map((v, i) => i * dF), y: spectrum } ],
      { margin: { t: 0 },
        xaxis: { title: { text: 'Frequency (Hz)' }, automargin: true, range: [0, 8000] },
        yaxis: { title: { text: 'Magnitude (dB)' }, automargin: true, range: [-100, -30] },
      }
    );
  }
  htmlEl.dataset.active = true;
}

export default App
