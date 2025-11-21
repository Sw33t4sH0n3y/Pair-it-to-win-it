const matchPairedEmojis = [
  ["☀️", "🌈", "Bright Day"],
  ["🦊", "🐥", "Best Friends"],
  ["✨", "🌜", "Starry Night"],
  ["🐝", "🌸", "Garden Match"],
  ["🚚", "🛑", "Truck Stop"],
  ["⭐️", "🐟", "Star Fish"],
  ["🇫🇷", "💋", "French Kiss"],
  ["❤️", "✉️", "Love Letter"],
  ["🌽", "🐶", "Corn Dog"],
  ["🍎", "⌚️", "Apple Watch"],
  ["🍔", "👑", "Burger King"],
  ["🐴", "👞", "Horse Shoe"],
  ["👶", "🚿", "Baby Shower"],
  ["📰", "⚓️", "News Anchor"],
  ["📞", "🏠", "Phone Home"],
  ["☁️","9️⃣", "Cloud Nine"],
  ["🌧️", "💃", "Rain Dance"],
  ["🌮", "🛎️", "Taco Bell"],
  ["🐍", "👀", "Snake Eyes"],
  ["🚫", "🚬", "No Smoking"]
];

let matchedPairs = [];
let totalAllowedTurns = 35;
let usedMoves = [];
let maxTimePerTurn = 20;
let numOfPlayers = 2;
let playerIdx = [];
let totalDraw = [];
let gamerPoints = [0, 0];

let primeDraw = null;
let supplemntDraw = null;
let inquiry = false;
let allowedTime = 0;
let timeSpell = null;
let ogPlayerIdx = 0;
let viewPlayMode = null;
let endGame = false;
let pcShot = false;

for (let pair of matchPairedEmojis) {
  totalDraw.push(pair[0]);
  totalDraw.push(pair[1]);
}

totalDraw.sort(() => Math.random() - 0.5);

const gameBoard = document.querySelector('#board');
const displayTimer = document.querySelector('#timer');
const moveValue = document.querySelector('#moves');
const matches = document.querySelector('#match');
const runInput = document.querySelector('#runInput');
const rebootMatch = document.querySelector('#rebootBtn');
const phraseDisplay = document.querySelector('#phrase-display');


function mateKey() {
  const keyMateBin = document.querySelector('#key-combos');
  keyMateBin.innerHTML = '';

  matchPairedEmojis.forEach((duo) => {
    const duoDiv = document.createElement('div');
    duoDiv.className = 'key-combo';
    duoDiv.innerHTML = `
        <span class="key-glyph">${duo[0]}</span>
        <span class="key-glyph">${duo[1]}</span>
        <span class="key-id">${duo[2]}</span>
        `;
    keyMateBin.appendChild(duoDiv);
  });
}
function init() {
  console.log('Pair it to win it", "Game Ready!');
  displayViewPlayMode();
  mateKey();
}

function displayViewPlayMode() {
 const vibeSwitchboard = document.querySelector('#vibe-switchboard');
 const brainBtn = document.querySelector('#mind-challenger');
 const bitsBytesBtn = document.querySelector('#bitsbytes-pc');

 vibeSwitchboard.classList.remove('hidden');

 brainBtn.addEventListener('click', () => {
    viewPlayMode = 'mind-challenger';
    vibeSwitchboard.classList.add('hidden');
    beginGame();
 })

 bitsBytesBtn.addEventListener('click', () => {
    viewPlayMode = 'pc';
    vibeSwitchboard.classList.add('hidden');
    beginGame();
 })
}



function beginGame() {
  console.log(
    `Play Mode: ${viewPlayMode === "gamer" ? "gamer vs gamer" : "gamer vs pc"}`
  );
  createGame();
  displayGamerMove();
}

function createGame() {
  gameBoard.innerHTML = '';

  for (let i = 0; i < totalDraw.length; i++) {
    const draw = document.createElement('div');
    draw.className = 'hidden-draw';
    draw.textContent = totalDraw[i];
    draw.setAttribute('pair', i);
    draw.addEventListener('click', flickEmoji);
    gameBoard.appendChild(draw);
  }
}

function getMate(emoji) {
  for (let duo of matchPairedEmojis) {
    if (duo[0] === emoji || duo[1] === emoji) {
      return duo[2];
    }
  }
  return null;
}
function flickEmoji(event) {
  const quickDraw = event.target;

  if (endGame || pcShot) {
    return;
  }

  if (inquiry || quickDraw === primeDraw || quickDraw === supplemntDraw) {
    return;
  }
  if (primeDraw === null) {
    beginTime();
  }

  quickDraw.classList.add('flicked');

  if (primeDraw === null) {
    primeDraw = quickDraw;
  } else if (supplemntDraw === null) {
    supplemntDraw = quickDraw;
    diagnosis();
  }
}
function diagnosis() {
  inquiry = true;

if (!primeDraw || !supplemntDraw) {
    inquiry = false;
    return;
  }

const glyph1 = primeDraw.textContent;
const glyph2 = supplemntDraw.textContent;

const twin1 = getMate(glyph1);
const twin2 = getMate(glyph2)
  

const isMate = (twin1 === twin2 && twin1 !== null);
const combo = twin1

  if (isMate) {
    console.log('MATCH!', '🥳');
    phraseDisplay.textContent = `🥳 ${combo}! You got this! Keep Going!`;
    phraseDisplay.style.color = '#000000';

    matchedPairs.push(combo);
    gamerPoints[ogPlayerIdx]++;

    primeDraw.classList.add('mate');
    supplemntDraw.classList.add('mate');

    primeDraw = null;
    supplemntDraw = null;
    inquiry = false;
    halt();

    setTimeout(() => {
      phraseDisplay.textContent = '';
    }, 2000);

    confirmEnd();

    if (!gameDone && viewPlayMode === 'pc' && ogPlayerIdx === 1) {
        pcShot = false;
        setTimeout(() => {
          pcShot = true;
          pcMove()
        }, 2000);
    } else if (pcShot) {
      pcShot = false;   
    }
  } else {
    console.log('Oops! Try Again🙁');
    phraseDisplay.textContent = 'Oops! Try Again 🙁';
    phraseDisplay.style.color = '#1f0404ff';

    const delayflick = pcShot ? 2000 : 1000;

    setTimeout(() => {

    if (primeDraw)  {
      primeDraw.classList.remove('flicked');
    }    
    if (supplemntDraw) {
      supplemntDraw.classList.remove('flicked');
    }

      primeDraw = null;
      supplemntDraw = null;
      inquiry = false;
      halt();
      usedMoves.push(1);

      phraseDisplay.textContent = '';

if (pcShot) {
    pcShot = false
}
      nxtPlayer();
      confirmEnd();
    }, delayflick);      
  }
}
function beginTime() {
  remainTime = maxTimePerTurn;
  displayTimer.textContent = remainTime;

  clearInterval(timeSpell);
  timeSpell = setInterval(() => {
    remainTime--;
    displayTimer.textContent = remainTime;

    if (remainTime <= 0) {
      halt();
      timeEnds();
    }
  }, 1000);
}

function timeEnds() {
  clearInterval(timeSpell);
  console.log('Too Slow! You gotta be faster Champ!');

  if (primeDraw) {
    primeDraw.classList.remove('flicked');
  }
  if (supplemntDraw) {
    supplemntDraw.classList.remove('flicked');
  }

  primeDraw = null;
  supplemntDraw = null;
  inquiry = false;
  usedMoves.push(1);
  nxtPlayer();
  confirmEnd();
}

function halt() {
  clearInterval(timeSpell);
}

function nxtPlayer() {
  ogPlayerIdx = (ogPlayerIdx + 1) % numOfPlayers;
  displayGamerMove();

  if (viewPlayMode === 'pc' && ogPlayerIdx === 1) {
    pcShot = true;
    setTimeout(pcMove, 1000);
  }
}
function displayGamerMove() {
  const gameStat = ogPlayerIdx + 1;
  console.log(`gamer ${gameStat}'s move!`);
  runInput.textContent = `gamer ${gameStat}'s move | Moves: ${usedMoves.length}/ ${totalAllowedTurns}`;
}

function confirmEnd() {
  const allPairs = matchPairedEmojis.length;

  if (
    matchedPairs.length === allPairs ||
    usedMoves.length >= totalAllowedTurns
  ) {
    endGameAction();
  }
}
function endGameAction() {
  gameDone = true;
  halt();

  const prime1tally = gamerPoints[0];
  const supplemnt2Tally = gamerPoints[1];

  let victor;
  if (prime1tally > supplemnt2Tally) {
    victor = 'primeGamer';
  } else if (supplemnt2Tally > prime1tally) {
    victor = viewPlayMode === 'pc' ? 'pc' : 'supplemntGamer';
  } else {
    victor = 'Tie';
  }
  console.log('Game Done');
  console.log(
    `primeGamer ${prime1tally} points | ${
      viewPlayMode === 'pc' ? 'pc': 'supplemntGamer'
    }: ${supplemnt2Tally} points`
  );
  console.log(`${victor} Won!`);

  const challengerName = viewPlayMode === 'pc' ? 'pc' : 'supplemntGamer';
  runInput.textContent = `Game Done! ${victor}Won! (Mind: ${prime1tally}, ${challengerName}: ${supplemnt2Tally})`;
}

function pcMove() {
  const gamePiece = document.querySelectorAll('.hidden-draw:not(.mate)');
  const reversePiece = Array.from(gamePiece).filter(
    (draw) => !draw.classList.contains('flicked')
  );

  if (reversePiece.length < 2) {
    pcShot = false;
    nxtPlayer();
    return;
  
  }

  const shuffleBasedIdx = Math.floor(Math.random() * reversePiece.length);
  const draw1 = reversePiece[shuffleBasedIdx];

  const leftOver = reversePiece.filter((_, idx) => idx !== shuffleBasedIdx);
  const shuffleBasedIdx2 = Math.floor(Math.random() * leftOver.length);
  const draw2 = leftOver[shuffleBasedIdx2];

    draw1.classList.add('flicked');
    primeDraw = draw1;

    beginTime();

  setTimeout(() => {
    draw2.classList.add('flicked');
  if (draw2) {  
    supplemntDraw= draw2;
    
  setTimeout(() => {
    diagnosis();

    }, 1500);
   }
  }, 1500); 
}

function reboot() {
  matchedPairs = [];
  usedMoves = [];
  gamerPoints = [0, 0];
  primeDraw = null;
  supplemntDraw = null;
  inquiry = false;
  allowedTime = 0;
  ogPlayerIdx = 0;
  endGame = false;
  pcShot = false;
  viewPlayMode = null

  clearInterval(timeSpell);

  totalDraw = [];
  for (let match of matchPairedEmojis) {
    totalDraw.push(match[0]);
    totalDraw.push(match[1]);
  }
    totalDraw.sort(() => Math.random() - 0.5);


    displayTimer.textContent = '0';
    phraseDisplay.textContent = '';
    phraseDisplay.style.color = '';
    runInput.textContent = '';
    matches.textContent = 'Matches: 0';
    
    createGame();
    displayViewPlayMode();

    console.log('Match Reboot');
}
const rebootBtn = document.querySelector('#rebootBtn')
if(rebootBtn) {  
  rebootBtn.addEventListener('click', reboot);
}

init();
