
class NoiseSourceProcessor extends AudioWorkletProcessor {
  constructor (options) { super(); }
  process(inputs, outputs, parameters) {
    for (let ch = 0; ch < outputs[0].length; ++ch) {
      for (let i = 0; i < outputs[0][ch].length; i++) {
        outputs[0][ch][i] = Math.random() * 2 - 1;
      } 
    }
   return true;
  }
}

registerProcessor('NoiseSourceProcessor',NoiseSourceProcessor);
