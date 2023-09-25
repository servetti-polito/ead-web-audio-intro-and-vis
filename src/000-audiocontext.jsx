import { AudioContextComponent  } from './Tools.jsx'

const audioCtx = new AudioContext();

function App() {

  return (
    <>
    <h1>Toggle AudioContext</h1>
    <p></p>
    <AudioContextComponent audioCtx={audioCtx}/>
    </>
  )
}

export default App
