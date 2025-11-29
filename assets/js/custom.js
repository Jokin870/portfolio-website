document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     SMART THERMOMETER 🌡️
     ========================== */
  const tempSlider = document.getElementById("tempSlider");
  const tempDisplay = document.getElementById("tempDisplay");
  const tempResult = document.getElementById("tempResult");

  if (tempSlider && tempDisplay && tempResult) {
    const emojis = [
      { min: -999, max: 0, emoji: "❄️" },
      { min: 1, max: 15, emoji: "🥶" },
      { min: 16, max: 25, emoji: "😌" },
      { min: 26, max: 35, emoji: "🌞" },
      { min: 36, max: 999, emoji: "🔥" }
    ];

    const colors = [
      { min: -999, max: 0, color: "#2b7cff" },
      { min: 1, max: 15, color: "#4aa3ff" },
      { min: 16, max: 25, color: "#ffb347" },
      { min: 26, max: 35, color: "#ff8c42" },
      { min: 36, max: 999, color: "#ff4c4c" }
    ];

    function updateThermometer() {
      const t = Number(tempSlider.value);
      tempDisplay.textContent = `${t}°C`;

      const e = emojis.find(o => t >= o.min && t <= o.max);
      tempResult.textContent = e?.emoji || "😌";
      tempResult.style.transform = "scale(1.2)";
      setTimeout(() => tempResult.style.transform = "scale(1)", 120);

      const c = colors.find(o => t >= o.min && t <= o.max);
      tempDisplay.style.color = c?.color || "#222";
      tempDisplay.style.fontWeight = "700";
    }

    tempSlider.addEventListener("input", updateThermometer);
    updateThermometer();
  }

  /* ==========================
     MEMORY GAME 🧠🎴 (fixed)
     ========================== */

  const difficultySelect = document.getElementById("difficulty");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const gameBoard = document.getElementById("gameBoard");
  const movesEl = document.getElementById("moves");
  const matchesEl = document.getElementById("matches");
  const winMessage = document.getElementById("winMessage");

  if (!gameBoard || !movesEl || !matchesEl || !winMessage || !difficultySelect || !startBtn || !restartBtn) {
    console.warn("Memory Game: missing DOM, cannot init.");
    return;
  }

  const dataset = ["🐶","🍎","⚽","🚗","🎧","🎮"];
  let deck = [];
  let firstCard = null;
  let secondCard = null;
  let boardLocked = false;
  let moves = 0;
  let matches = 0;
  let pairTarget = 6;

  function shuffle(a) {
    for (let i=a.length-1; i>0; i--) {
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function buildDeck(pairs) {
    const items=[];
    for (let i=0;i<pairs;i++) items.push(dataset[i%dataset.length]);
    return shuffle([...items, ...items]);
  }

  function renderBoard(pairs) {
    firstCard=null;
    secondCard=null;
    boardLocked=false;
    gameBoard.innerHTML="";
    deck=buildDeck(pairs);
    resetStats();

    deck.forEach((emoji, idx) => {
      const card=document.createElement("button");
      card.className="card";
      card.type="button";
      card.dataset.emoji=emoji;
      card.dataset.index=idx;
      card.innerHTML=`<span>${emoji}</span>`;
      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
    });

    gameBoard.style.gridTemplateColumns = pairs === 12 ? "repeat(6, 1fr)" : "repeat(4, 1fr)";
  }

  function resetStats() {
    moves=0;
    matches=0;
    pairTarget = difficultySelect.value === "hard" ? 12 : 6;
    pairTarget=pairTarget/2;
  }

  function resetStats() {
    moves=0;
    matches=0;
    if(movesEl)movesEl.textContent=moves;
    if(matchesEl)matchesEl.textContent=matches;
    winMessage.textContent="";
  }

  startBtn.addEventListener("click", ()=>renderBoard(tempDifficulty === "hard" ? 12 : 6));
  restartBtn.addEventListener("click", ()=>renderBoard(tempDifficulty === "hard" ? 12 : 6));
  difficultySelect.addEventListener("change", ()=>renderBoard(tempDifficulty === "hard" ? 12 : 6));

  function flipCard(e) {
    const card=e.currentTarget;
    if(boardLocked) return;
    if(card.classList.contains("matched")) return;
    if(firstCard && card===firstCard) return;

    card.classList.add("flipped");

    if(!firstCard) {
      firstCard=card;
      return;
    }

    secondCard=card;
    boardLocked=true;
    moves++;
    if(movesEl) movesEl.textContent=moves;

    const a = firstCard.dataset.emoji;
    const b = secondCard.dataset.emoji;

    if(a===b) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matches++;
      if(matchesEl) matchesEl.textContent=matches;
      firstCard=null;
      secondCard=null;
      boardLocked=false;

      if(matches=== (difficultySelect.value==="hard"?6:6)) {
        winMessage.textContent="🎉 You won!";
        showPopup("🏆 Congrats, you matched them all!");
      }
    } else {
      setTimeout(()=>{
        firstCard?.classList.remove("flipped");
        secondCard?.classList.remove("flipped");
        firstCard=null;
        secondCard=null;
        boardLocked=false;
        boardLocked=false;
      }, 1000);
    }
  }

  function showPopup(msg) {
    const p=document.createElement("div");
    p.className="custom-popup";
    p.textContent=msg;
    document.body.appendChild(p);
    requestAnimationFrame(()=>p.classList.add("show"));
    setTimeout(()=>p.classList.remove("show"),2800);
    setTimeout(()=>p.remove(),3100);
  }

  // Inicia en Easy
  renderBoard(6);
});

