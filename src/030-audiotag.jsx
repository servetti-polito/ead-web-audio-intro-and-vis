import { useState, useEffect, useRef } from 'react';
import { ToggleTextButton } from './Tools.jsx'

function App() {

  const audioEl = useRef(0);

  useEffect( () => {
    /*
    // needed to sync app state with player
    // const [playing, setPlaying] = useState(false);
    // <ToggleTextButtonFlag flag={playing} // gets flag from parent
    audioEl.current.addEventListener('play', () => { setPlaying(true); })
    audioEl.current.addEventListener('pause', () => { setPlaying(false) })
    */
  }, [])

  return (
    <>
      <p></p>
      <div>
        <audio id="audio" ref={audioEl} loop controls src="/media/singing.mp3" style={{ width: "50%" }}> </audio>
      </div>
      <p></p>
      <div>
        <ToggleTextButton handleClick={[ () => audioEl.current.play(), () => audioEl.current.pause() ]}
          text={["Play", "Pause"]} />
      </div>
      <p></p>
      <CurrentTime audioEl={audioEl} />      
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
