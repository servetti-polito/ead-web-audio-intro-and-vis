/* eslint-disable react/prop-types */

import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js/dist/plotly';


function AudioAnalyser(props) {

  const waveformPlot = useRef(null);
  const spectrumPlot = useRef(null);

  useEffect( () => {
    console.log('useEffect', props.analyser);
    let interval;
    if(props.analyser) 
      interval = setInterval( () => draw(), 50);
    return ( () => clearInterval(interval) )  // proper handling of unmounting
  }, [props.analyser])

  const draw = () => {
    // console.log('draw', props, props.analyser, props.sampleRate)
    if(props.analyser) {
    const timeDataArray = new Float32Array(props.analyser.fftSize);
    props.analyser.getFloatTimeDomainData(timeDataArray);
    waveformPlotFn(waveformPlot.current, timeDataArray, props.sampleRate);

    const freqDataArray = new Float32Array(props.analyser.frequencyBinCount);
    props.analyser.getFloatFrequencyData(freqDataArray);
    spectrumPlotFn(spectrumPlot.current, freqDataArray, props.sampleRate);
    }
  };


  return(
    <>
      <table style={{ width: "100%" }}><tbody><tr>
        <td style={{ width: "40%" }}><div ref={spectrumPlot} data-active="false"></div></td>
        <td style={{ width: "40%" }}><div ref={waveformPlot} data-active="false"></div></td>
      </tr></tbody></table>
    </>
  );


  }


function waveformPlotFn(htmlEl, wave, sampleRate) {
  const sr = sampleRate;
  if (htmlEl.dataset.active == 'true') {
    Plotly.animate(htmlEl,
      { data: [{ x: wave.map((v, i) => i / sr), y: wave }] },
      { transition: { duration: 0 }, frame: { duration: 0, redraw: false }, }
    );
  } else {
    Plotly.newPlot(htmlEl,
      [{ x: wave.map((v, i) => i / sr), y: wave }],
      {
        margin: { t: 0 },
        xaxis: { title: { text: 'Time (s)' }, automargin: true, range: [0, 0.02] },
        yaxis: { title: { text: 'Amplitude' }, automargin: true, range: [-1, +1] }
      }
    );
  }
  htmlEl.dataset.active = true;
}

function spectrumPlotFn(htmlEl, spectrum, sampleRate) {
  const dF = sampleRate / (2 * spectrum.length);
  if (htmlEl.dataset.active == 'true') {
    Plotly.animate(htmlEl,
      { data: [{ x: spectrum.map((v, i) => i * dF), y: spectrum }] },
      { transition: { duration: 0 }, frame: { duration: 0, redraw: false } }
    );
  } else {
    Plotly.newPlot(htmlEl,
      [{ x: spectrum.map((v, i) => i * dF), y: spectrum }],
      {
        margin: { t: 0 },
        xaxis: { title: { text: 'Frequency (Hz)' }, automargin: true, range: [0, 8000] },
        yaxis: { title: { text: 'Magnitude (dB)' }, automargin: true, range: [-100, -30] },
      }
    );
  }
  htmlEl.dataset.active = true;
}

export { AudioAnalyser };
