const body = document.querySelector("body");
const startGame = document.querySelector(".start-balloon");
const welcomePage = document.querySelector(".welcomePage");
const menu = document.querySelector(".menu");
const scoreText = document.querySelector("#score");
const highScoreText = document.querySelector("#high-score");
const menuBtn = document.querySelector(".pause-btn");
const controlBtn = document.querySelector(".control");
const resumeBtn = document.querySelector(".resume-btn");
const resetBtn = document.querySelector(".reset-btn");
const exitBtn = document.querySelector(".exit-btn");
const gameBoard = document.querySelector("#gameBoard");
const balloonContainer = document.querySelector(".balloon-container");
const scoreUpdateMessage = document.querySelector(".scoreUpdateMessage");
const homepageSound = document.querySelector('.homepageSound')
const popBalloonSound = document.querySelector('.popBalloonSound')
const soundIconBtn = document.querySelector('.sound-icon-btn')
const volumeUpIcon = document.querySelector('.volume-up')
const volumeMuteIcon = document.querySelector('.volume-mute')
const time = document.querySelector('#time')


let intervalId;
let timeInterval;
let totalTime = 59;
let score = 0;
let currentHighScore = localStorage.getItem("High Score:");

const storeHighScore = (currentScore)=>{
  localStorage.setItem("High Score:",currentScore)
  // console.log(localStorage)
}
highScoreText.textContent = currentHighScore

// console.log(currentHighScore)

welcomePage.addEventListener('click',()=>{
  homepageSound.play()
  const isActive = volumeUpIcon.getAttribute('isActive') === "false"; 
  if (isActive) {
    volumeUpIcon.setAttribute('isActive', "false");
    volumeMuteIcon.classList.remove('hidden');
    volumeUpIcon.classList.add('hidden');
  } else {
    volumeUpIcon.setAttribute('isActive', "true");
    volumeMuteIcon.classList.add('hidden');
    volumeUpIcon.classList.remove('hidden');
  }
})

soundIconBtn.addEventListener('click', () => {
  const isActive = volumeUpIcon.getAttribute('isActive') === "true"; 
  if (isActive) {
    volumeUpIcon.setAttribute('isActive', "false");
    volumeMuteIcon.classList.remove('hidden');
    volumeUpIcon.classList.add('hidden');
    homepageSound.volume = 0
  } else {
    volumeUpIcon.setAttribute('isActive', "true");
    volumeMuteIcon.classList.add('hidden');
    volumeUpIcon.classList.remove('hidden');
    homepageSound.volume = 1
  }
});


const slideUpDown = (deg) => {
  startGame.style.transition = "transform 0.5s ease-in-out";
  startGame.style.transform = `translateY(${deg}%)`;
};

const showHide = (element, display) => {
  element.style.display = display;
};

const showStart = () => {
  slideUpDown(0);
};
const hideStart = () => {
  slideUpDown(100);
};

const toggleBlur = (addRemove) => {
  if (addRemove === true) {
    controlBtn.classList.add("blur-[2px]");
  }
  if (addRemove === false) {
    controlBtn.classList.remove("blur-[2px]");
  }
};

const showScorePoint = (score,color) => {  
    setTimeout(() => {
        scoreUpdateMessage.textContent = `${score}`;
        scoreUpdateMessage.style.color = `${color}`;
        showHide(scoreUpdateMessage, "block");
      }, 10);
        setTimeout(() => {
            showHide(scoreUpdateMessage, "none");
        }, 1500);
}


const createBalloons = () => {
  const balloon = document.createElement("div");
  balloon.classList.add("text-[200px]", "cursor-pointer", "balloon");
  balloon.textContent = "🎈";

  const xPositon = Math.random() * window.innerWidth;
  const yPositon = Math.random() * window.innerHeight;
  balloon.style.position = "absolute";
  balloon.style.zIndex = "100000000000";
  balloon.style.left = `${xPositon % (window.innerWidth - 200)}px`;
  balloon.style.top = `${yPositon % (window.innerHeight - 200)}px`;
  
  let red = 20;
  let green = 100;
  let blue = 200;
  let pink = 300;

  const colors = [red, green, blue, pink];
  let color = colors[Math.floor(Math.random() * colors.length)];

  balloon.style.filter = `hue-rotate(${color}deg)`;
  balloon.style.fontSize = `${Math.random() * 100 + 150}px`;
  balloonContainer.appendChild(balloon);

  balloon.addEventListener("click", function pop() {
    popBalloonSound.play()
    balloonContainer.removeChild(this);

    if (color === 20) {
      score += 1;
      showScorePoint("+1","red");
    }
    if (color === 100) {
      score += 2;
      showScorePoint("+2","green");
    }
    if (color === 200) {
      score += 3;
      showScorePoint("+3","blue");
    }
    if (color === 300) {
      score += 4;
      showScorePoint("+4","purple");
    }
    if (score <= 0) {
      score = 0;
    }
    if (score < 10) {
      scoreText.textContent = `00${score}`;
    } else if (score < 100) {
      scoreText.textContent = `0${score}`;
    } else {
      scoreText.textContent = score;
    }
    // console.log(score);
    highScoreText.textContent = (score > currentHighScore) ? score : currentHighScore;
    (score > currentHighScore) ? storeHighScore(score) : storeHighScore(currentHighScore) 
  });
};

const generateBalloons = () => {
  intervalId = setInterval(createBalloons, 500);
};


const setTime = ()=>{
  totalTime +=1;
  timeInterval = setInterval(()=>{
    if(totalTime <= 0){
      return openMenu(true)
    } 
    totalTime--;
    time.textContent = totalTime < 10 ? `0${totalTime}` : totalTime
  },1000)
}



const openGameBoard = () => {
  showHide(welcomePage, "none");
  showHide(menu, "none");
  showHide(gameBoard, "flex");
  showHide(scoreUpdateMessage, "none");
  homepageSound.volume = 0
  setTimeout(()=>{
    setTime()
    setTimeout(()=>{
      generateBalloons();
    },100)
  },100)

};

const togglePop = (remove = true) => {
  const balloons = document.querySelectorAll(".balloon");
  balloons.forEach((balloon) => {
    balloon.style.pointerEvents = remove ? "none" : "auto";
  });
};

const resumeGame = () => {
  homepageSound.volume = 0
  showHide(menu, "none");
  menuBtn.textContent = "Pause";
  menuBtn.style.visibility = "visible"
  toggleBlur(false);
  balloonContainer.style.opacity = "1";
  togglePop(false);
  if (!intervalId) {
    generateBalloons();
  }
  setTime()
};

const resetGame = () => {
  
  homepageSound.volume = 0
  showHide(menu, "none");
  showHide(gameBoard, "flex");
  menuBtn.textContent = "Pause";
  menuBtn.style.visibility = "visible"
  toggleBlur(false);
  balloonContainer.style.opacity = "1";
  const balloons = document.querySelectorAll(".balloon");
  balloons.forEach((balloon) => {
    balloonContainer.removeChild(balloon);
  });
  totalTime = 60
  setTime()
  setTimeout(()=>{
    generateBalloons();
  },100)
  score = 0;
    scoreText.textContent = `00${score}`;
};

const exitGame = () => {
  showHide(menu, "none");
  showHide(gameBoard, "none");
  showHide(welcomePage, "flex");
  menuBtn.textContent = "Pause";
  menuBtn.style.visibility = "visible"
  toggleBlur(false);
  homepageSound.volume = 1
  balloonContainer.style.opacity = "1";
  const balloons = document.querySelectorAll(".balloon");
  balloons.forEach((balloon) => {
    balloonContainer.removeChild(balloon);
  });
  clearInterval(intervalId);
  clearInterval(timeInterval)
  totalTime = 59
  intervalId = 0;
  score = 0;
  scoreText.textContent = `00${score}`;
  const isActive = volumeUpIcon.getAttribute('isActive') === "false"; 
  if (isActive) {
    volumeUpIcon.setAttribute('isActive', "false");
    volumeMuteIcon.classList.remove('hidden');
    volumeUpIcon.classList.add('hidden');
    homepageSound.volume = 0
  } else {
    volumeUpIcon.setAttribute('isActive', "true");
    volumeMuteIcon.classList.add('hidden');
    volumeUpIcon.classList.remove('hidden');
    homepageSound.volume = 1
  }
};

const openMenu = (playAgain = false) => {
  homepageSound.volume = 1
  let isPaused = menuBtn.textContent.includes("Pause");
  if (isPaused) {
    isPaused = false;
    togglePop();
    menuBtn.textContent = "Resume";
    showHide(menu, "flex");
    toggleBlur(true);
    balloonContainer.style.opacity = "0.4";
    clearInterval(intervalId);
    intervalId = 0;
    clearInterval(timeInterval)
  }
  if(playAgain){
    menuBtn.style.visibility = "hidden"
    resumeBtn.textContent = `Your Score: ${score}`
    resumeBtn.disabled = "true"
    resetBtn.textContent = "Play Again"
    resetBtn.addEventListener("click", resetGame);
    exitBtn.addEventListener("click", exitGame);
  }
  else{
    resumeBtn.disabled = "false"
    resumeBtn.textContent = "Resume"
    resetBtn.textContent = "Reset"
    resumeBtn.addEventListener("click", resumeGame);
    resetBtn.addEventListener("click", resetGame);
    exitBtn.addEventListener("click", exitGame);
  }
};
// openGameBoard();
const openM =()=> {
  openMenu(false)
  menuBtn.style.visibility = "hidden"
}
startGame.addEventListener("click", openGameBoard);
menuBtn.addEventListener("click", openM);
body.addEventListener("mouseover", showStart);
body.addEventListener("mouseout", hideStart);