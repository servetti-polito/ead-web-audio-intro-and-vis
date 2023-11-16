
class NoiseSourceProcessor extends AudioWorkletProcessor {

  static get parameterDescriptors() {
    return [  {name: 'gain', defaultValue: 1 } ];
  }

  constructor (options) { super( options ); }

  process(inputs, outputs, parameters) {
    console.log('processor gain:', parameters["gain"][0])
    for (let ch = 0; ch < outputs[0].length; ++ch) {
      for (let i = 0; i < outputs[0][ch].length; i++) {
        outputs[0][ch][i] = (Math.random() * 2 - 1 ) * parameters["gain"][0];
      } 
    }
   return true;
  }

}

registerProcessor('NoiseSourceProcessor',NoiseSourceProcessor);
