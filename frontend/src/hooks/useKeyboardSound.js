const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

const useKeyboardSound = () =>{
    const playRandonKeyStrokeSound = ()=>{
        const RandomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];
        RandomSound.currentTime = 0;
        RandomSound.play().catch(error => console.log("Audio Error:",error));
        
    }

    return {playRandonKeyStrokeSound};
}

export default useKeyboardSound