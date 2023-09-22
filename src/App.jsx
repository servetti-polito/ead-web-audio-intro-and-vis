import { useState, useEffect } from 'react';

const audioCtx = new AudioContext();

function App() {

  const [audioContextState, setAudioContextState] = useState( audioCtx.state == "running"  )

  /*
  useEffect( () => {
    const update = async () => {
      if (audioContextState) {
        await audioCtx.resume();
        console.log('resumed', audioCtx);
       } else { 
        await audioCtx.suspend(); 
        console.log('suspended', audioCtx);
       }
    };
    update();    
  }, [audioContextState]);
  */
  

  function handleAudioContextStateChange(ev) {  
    setAudioContextState(ev.target.checked);  
    if (ev.target.checked) audioCtx.resume();
    else audioCtx.suspend(); 
  }

  return (
    <>
      <h1>EAD</h1>
      <label htmlFor="audioContextState">AudioContext state: {audioContextState}</label>
      <input type="checkbox" id="audioContextState" name="audioContextState"
        checked={audioContextState.flag} onChange={ (ev) => handleAudioContextStateChange(ev) } />
      {/* audioCtx.state */}
    </>
  )
}

export default App
