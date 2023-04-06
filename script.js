// variables decalaration
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let movesCount = 0;
let winCount = 0;
//array
const items = [
  { name: "cat", image: "cat.png" },
  { name: "dog", image: "dog.jpg" },
  { name: "elephant", image: "elephant.png" },
  { name: "horse", image: "horse.jpg" },
  { name: "tiger", image: "tiger.jpg" },
  { name: "lion", image: "lion.png" },
  { name: "pig", image: "pig.png" },
  { name: "rabbit", image: "rabbit.jpg" },
];

//element selection
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

//functions
//1.Time calculation
let seconds = 0;
let minutes = 0;
const timeCalculation = () => {
  seconds += 1;
  //minutes
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying( like time:09:18)
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//2.MoveS Calculation for Each matched image
const movesCalculation = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//3.Randomize image display
const RandomCalculator = (size = 4) => {
  //clone array using spread operator.
  let tempArray = [...items];

  let cardValues = [];
  size = (size * size) / 2;
  //here loop 0 to 7(total loop 8)
  for (let i = 0; i < size; i++) {
    //random number between 0 to 8
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1); //remove 1 item at a time
  }
  return cardValues;
};
//4.getting images into cell
const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues]; //array length=16
  //a.sort(() => Math.random() - 0.5)
  //either negative or positive it will cause a random order
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before"></div> 
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid layout (auto property)
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
  // card selection
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //here !false
      if (!card.classList.contains("matched")) {
        card.classList.add("flipped");
        //firstcard cant flipped..
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //moves value increased when cards values are matched
          movesCalculation();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          //values matched wincount increased.
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;
            //wincount upto 8
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>
            <h3>Time:${minutes}:${seconds}</h3>`;
              stopGame(); //reached 8 match
            }
          } else {
            //items are not matched
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            //settimeout for false selection need to flipback again
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};
//EventListener for start button
startButton.addEventListener("click", () => {
  //counts increased from zero
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //buttons are visible
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //timer initaialized
  interval = setInterval(timeCalculation, 1000);
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;

  initializer();
});
//EventListener for stop Button
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);
// function calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = RandomCalculator();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
