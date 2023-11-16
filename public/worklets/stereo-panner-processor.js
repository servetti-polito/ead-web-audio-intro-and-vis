
class StereoPannerProcessor extends AudioWorkletProcessor {

  static get parameterDescriptors() {
    return [{ name: 'pan', defaultValue: 0 }];
  }

  constructor(options) {
    super(options);
    this.logFlag = 0;
  }

  process(inputs, outputs, parameters) {

    if (!this.logFlag) {
      console.log('processor pan :', parameters["pan"][0])
      console.log('I/O:', inputs.length, outputs.length)
      console.log('Channels:', inputs[0].length, outputs[0].length)
      this.logFlag = !this.logFlag;
    }

    if (inputs.length == 0 || inputs[0].length != 1 || outputs.length == 0 || outputs[0].length != 2) {
      console.log('Terminate', inputs.length, inputs[0].length, outputs.length, outputs[0].length);
      return false;
    }

    const LEFT = 1, RIGHT = 0;
   
    const p = parameters["pan"][0];
    const gR = Math.cos((p + 1) * Math.PI / 4);
    const gL = Math.sin((p + 1) * Math.PI / 4);
    // console.log('Stereo Panner Processor:', p, gR, gL);

    let enIn = 0, enOut = Array(2).fill(0);

    for (let i = 0; i < inputs[0][0].length; i++) {
      enIn += inputs[0][0][i] * inputs[0][0][i];
      outputs[0][LEFT][i] = gL * inputs[0][0][i]; // left
      enOut[LEFT] += outputs[0][LEFT][i] * outputs[0][LEFT][i];
      outputs[0][RIGHT][i] = gR * inputs[0][0][i]; // right
      enOut[RIGHT] += outputs[0][RIGHT][i] * outputs[0][RIGHT][i];
    }

    this.port.postMessage({ enIn, enOut });

    return true;

  }
}

registerProcessor('StereoPannerProcessor', StereoPannerProcessor);
