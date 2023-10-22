/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js/dist/plotly';
import FFT from './fft.js'


function AudioVisualiser(props) {

  const waveformPlot = useRef(null);
  const spectrumPlot = useRef(null);
  
  /*
  useEffect( () => {
    console.log('useEffect', props.analyser);
    let interval;
    if(props.analyser) 
      interval = setInterval( () => draw(), 50);
    return ( () => clearInterval(interval) )  // proper handling of unmounting
  }, [props.analyser])
  */

  useEffect( () => {
    // console.log('useEffect', props.timeDataArray, waveformPlot.current);
    if(props.timeDataArray && props.sampleRate && waveformPlot.current?.dataset)
      { 
        draw();
      }
  }, [props.timeDataArray, waveformPlot])

  const draw = () => {
    // console.log('draw', props, props.analyser, props.sampleRate)
    /*
    if(props.analyser) {
    const timeDataArray = new Float32Array(props.analyser.fftSize);
    props.analyser.getFloatTimeDomainData(timeDataArray);
    */
    waveformPlotFn(waveformPlot.current, props.timeDataArray, props.sampleRate);
    /*
    const freqDataArray = new Float32Array(props.analyser.frequencyBinCount);
    props.analyser.getFloatFrequencyData(freqDataArray);
    */
    spectrumPlotFn(spectrumPlot.current, waveToSpectrum(props.timeDataArray), props.sampleRate);
    /*
    }
    */
  };

  function waveToSpectrum(wave) {
    const fft = new FFT(4096);
    const out = fft.createComplexArray();
    fft.transform(out, fft.toComplexArray(wave));
    let magnitude = [];
    for(let i=0; i<out.length/2+1; i+=2)  {
      magnitude[i/2] = 10 * Math.log10(out[i] ** 2 + out[i+1] ** 2);
    }
    console.log('waveToSpectrum', magnitude)
    return magnitude;
  }




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
        xaxis: { title: { text: 'Time (s)' }, automargin: true },
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
        yaxis: { title: { text: 'Magnitude (dB)' }, automargin: true, range: [-60, 10] },
      }
    );
  }
  htmlEl.dataset.active = true;
}

export { AudioVisualiser };
