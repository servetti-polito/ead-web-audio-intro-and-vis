import { useState, useEffect } from 'react';
import { AudioContextComponent, OneTimeButton, CheckboxController } from './Tools.jsx'

const audioCtx = new AudioContext();
const sr = audioCtx.sampleRate;

function fillWithSineTone(buffer, freq, sr) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = Math.sin(2 * Math.PI * freq * i / sr);
  }
}

function App() {

  const [audioNodes, setAudioNodes] = useState(null)

  useEffect(() => {
    const update = async () => {
      const bufferSrc = new AudioBufferSourceNode(audioCtx)
      // create AudioBuffer     
      const sec = 3;
      const myArrayBuffer = new AudioBuffer(
        { numberOfChannels: 2, length: (sec * sr), sampleRate: sr }
      );
      for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
        const nowBuffering = myArrayBuffer.getChannelData(channel);
        fillWithSineTone(nowBuffering, 440, audioCtx.sampleRate);
      }
      // set AudioBuffer
      bufferSrc.buffer = myArrayBuffer;
      bufferSrc.loop = true;
      // connect
      bufferSrc.connect(audioCtx.destination);
      // audioNodes.bufferSrc.start();

      setAudioNodes((audioNodes) => ({ ...audioNodes, bufferSrc }))
    }
    update();
  }, [])


  // we could use radio buttons to synth other frequencies in the buffer
  // new freq sill start when the buffer is re-read for the next loop


  return (
    <>
      <AudioContextComponent audioCtx={audioCtx} />
      <p></p>
      <OneTimeButton handleClick={() => audioNodes.bufferSrc.start()}>Start SourceBuffer</OneTimeButton>
    </>
  )

}

export default App
