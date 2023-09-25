import { useState, useEffect, useRef } from 'react';

function App() {

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const audioEl = useRef(0);
  // console.log(audioEl.current);

  useEffect( () => {
    audioEl.current.addEventListener('timeupdate', () => {
      // console.log(audioEl.current.currentTime)
      setCurrentTime(audioEl.current.currentTime);
    })
  }, [])


  function handlePlayBtnClick() {
    setPlaying(!playing);
    if (playing) audioEl.current.pause();
    else audioEl.current.play();
  }

  return (
    <>
      <div>
        <p>
        <audio id="audio" ref={audioEl} loop controls src="/singing.mp3" style={{ width: "50%" }}> </audio>
        </p>
      </div>
      <div>
        <p>
        <button id="play" type="button" onClick={handlePlayBtnClick}>Play/Pause</button>
        &nbsp;
        <span>CurrentTime: {currentTime}</span>
        </p>
      </div>
    </>
  )

}

export default App
