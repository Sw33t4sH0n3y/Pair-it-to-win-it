const emoJis = ['🌈', '🦊', '🐝', '🚚', '✨','🌸', '🛑', '🌜', '🐥', '☀️'];

function waterMark() {
  const wmark = document.createElement('div');
  wmark.className = 'wmark';
  wmark.textContent = emoJis[Math.floor(Math.random()* emoJis.length)];
  
  wmark.style.left = Math.random() * 100 + '%';
  wmark.style.animationDelay = Math.random() * 20 + 's';
  wmark.style.animationDuration = (15 + Math.random() * 10) + 's';

  return wmark
}

const wmarkContainer = document.querySelector('#wmark-container');
const numOfWmarks = 10;

for (let i = 0; i < numOfWmarks; i++) {
  wmarkContainer.appendChild(waterMark());
}

setInterval(() => {
  if (wmarkContainer.children.length < 20) {
    wmarkContainer.appendChild(waterMark());
  }
}, 3000);

setInterval(() => {
  const wmarks = wmarkContainer.querySelectorAll('.wmark');
  wmarks.forEach(w => {
    const rect = w.getBoundingClientRect();
    if (rect.top < -100) {
      w.remove();
    }
  });
}, 5000);

let pcMedulla = {};

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

  if (viewPlayMode === 'pc') {
    const pcDrawIdx = quickDraw.getAttribute('pair');
    pcMedulla[pcDrawIdx] = quickDraw.textContent;
  }

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

    if (!endGame && viewPlayMode === 'pc' && ogPlayerIdx === 1) {
        pcShot = false;
        setTimeout(() => {
          pcShot = true;
          pcMove()
        }, 2500);
    } else if (pcShot) {
      pcShot = false;   
    }
  } else {
    console.log('Oops! Try Again🙁');
    phraseDisplay.textContent = 'Oops! Try Again 🙁';
    phraseDisplay.style.color = '#1f0404ff';

    const delayflick = pcShot ? 2000 : 1500;

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
  endGame = true;
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
let draw1 = null;
let draw2 = null;
let mateFound = false

const mindCode = Object.keys(pcMedulla);
for (let i = 0; i < mindCode.length && !mateFound; i++){
  for (let j = i + 1; j < mindCode.length; j++) {
    const draw1Comp = pcMedulla[mindCode[i]];
    const draw2Comp = pcMedulla[mindCode[j]];

    const mate1 = getMate(draw1Comp);
    const mate2 = getMate(draw2Comp);

  if (mate1 === mate2 && mate1 !== null) {
    const draw1Element = document.querySelector(`.hidden-draw[pair="${mindCode[i]}"]:not(.mate):not(.flicked)`);
    const draw2Element = document.querySelector(`.hidden-draw[pair="${mindCode[j]}"]:not(.mate):not(.flicked)`);
    
    if (draw1Element && draw2Element) {
      draw1 = draw1Element;
      draw2 = draw2Element;
      mateFound = true;
      console.log('MATCH! Keep Going!');
      break;
      }
    }
  }
}

if (!mateFound) {
  if (Math.random() < 0.3 && mindCode.length> 0) {
    const minIdx = mindCode[Math.floor(Math.random() * mindCode.length)];
    const minDrw = document.querySelector(`.hidden-draw[pair="${minIdx}"]:not(.mate):not(.flicked)`);
    if (minDrw) {
      draw1 = minDrw
      const exTra = reversePiece.filter(d => d !== draw1);
      if (exTra.length > 0) {
        draw2 = exTra[Math.floor(Math.random() * exTra.length)];
      }
    }
  }

  if (!draw1 || !draw2) {
  const shuffleBasedIdx = Math.floor(Math.random() * reversePiece.length);
   draw1 = reversePiece[shuffleBasedIdx];

  const leftOver = reversePiece.filter((_, idx) => idx !== shuffleBasedIdx);
  if (leftOver.length === 0) {
    pcShot =false;
    nxtPlayer();
    return;
  }
  const shuffleBasedIdx2 = Math.floor(Math.random() * leftOver.length);
  draw2 = leftOver[shuffleBasedIdx2];
  }
}

  draw1.classList.add('flicked');
    primeDraw = draw1;

  const drw1Idx = draw1.getAttribute('pair');
  pcMedulla[drw1Idx] = draw1.textContent;

    beginTime();

  setTimeout(() => {
    draw2.classList.add('flicked');
    supplemntDraw= draw2;

  const drw2Idx = draw2.getAttribute('pair');
  pcMedulla[drw2Idx] = draw2.textContent;
    
  
  setTimeout(() => {
    diagnosis();

    }, 1500);  
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
  pcMedulla = {};
  viewPlayMode = null

  clearInterval(timeSpell);
  timeSpell = null;

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
