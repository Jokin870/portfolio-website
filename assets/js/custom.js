// assets/js/custom.js
document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     CONTACT FORM (ratings)
     ========================= */
  const form = document.getElementById("contactForm");
  const results = document.getElementById("formResults");

  // rating sliders + displays (if present)
  const ratingPairs = [
    { slider: document.getElementById("rating1"), disp: document.getElementById("rating1Val") },
    { slider: document.getElementById("rating2"), disp: document.getElementById("rating2Val") },
    { slider: document.getElementById("rating3"), disp: document.getElementById("rating3Val") }
  ];

  ratingPairs.forEach(pair => {
    if (pair.slider && pair.disp) {
      // initialize display
      pair.disp.textContent = pair.slider.value;
      pair.slider.addEventListener("input", () => pair.disp.textContent = pair.slider.value);
    }
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        rating1: Number((document.getElementById("rating1") || {value:0}).value),
        rating2: Number((document.getElementById("rating2") || {value:0}).value),
        rating3: Number((document.getElementById("rating3") || {value:0}).value)
      };

      console.log("Form Data:", data);

      // build output (non-rating fields)
      let outputLines = [];
      ["name","surname","email","phone","address"].forEach(k => {
        let label = k === "phone" ? "Phone number" : k.charAt(0).toUpperCase() + k.slice(1);
        outputLines.push(`${label}: ${data[k]}`);
      });

      const avg = ((data.rating1 + data.rating2 + data.rating3) / 3).toFixed(1);
      let color = avg < 4 ? "red" : (avg < 7 ? "orange" : "green");
      outputLines.push(`${data.name} ${data.surname}: ` + `<span style="color:${color}; font-weight:700">${avg}</span>`);

      if (results) {
        results.innerHTML = outputLines.join("<br>");
        // Scroll into view lightly
        results.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      showPopup("Form submitted successfully!");
    });
  }

  function showPopup(msg) {
    const p = document.createElement("div");
    p.className = "custom-popup";
    p.textContent = msg;
    document.body.appendChild(p);
    // force reflow then show
    requestAnimationFrame(() => p.classList.add("show"));
    setTimeout(() => p.classList.remove("show"), 2800);
    setTimeout(() => p.remove(), 3100);
  }

  /* =========================
     SMART THERMOMETER
     ========================= */
  const tempSlider = document.getElementById("tempSlider");
  const tempDisplay = document.getElementById("tempDisplay");
  const tempResult = document.getElementById("tempResult");

  function updateTempUI() {
    if (!tempSlider || !tempDisplay || !tempResult) return;
    const val = Number(tempSlider.value);
    tempDisplay.textContent = `${val}°C`;

    let status = "";
    let color = "";
    if (val < 0) { status = "Freezing ❄️"; color = "#2b7cff"; }
    else if (val < 15) { status = "Cold 🥶"; color = "#4aa3ff"; }
    else if (val < 25) { status = "Comfortable 😌"; color = "#ffb347"; }
    else if (val < 35) { status = "Warm 🌞"; color = "#ff8c42"; }
    else { status = "Hot 🔥"; color = "#ff4c4c"; }

    tempResult.textContent = status;
    tempResult.style.color = color;
  }

  if (tempSlider) {
    updateTempUI(); // initial
    tempSlider.addEventListener("input", updateTempUI);
  }

  /* =========================
     MEMORY GAME (fixed & robust)
     ========================= */

  // DOM references for the game (safe)
  const difficultySelect = document.getElementById("difficulty");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const gameBoard = document.getElementById("gameBoard");
  const movesEl = document.getElementById("moves");
  const matchesEl = document.getElementById("matches");
  const winMessage = document.getElementById("winMessage");

  // If any required game element is missing, skip game init (avoid errors)
  const gameElementsPresent = gameBoard && movesEl && matchesEl && winMessage && difficultySelect && startBtn && restartBtn;
  if (!gameElementsPresent) {
    // no game or missing elements — don't crash
    console.warn("Memory Game: missing DOM elements, skipping initialization.");
    return;
  }

  // data source (6 unique items)
  const cardEmojis = ["🐶","🐱","🦊","🐼","🐸","🐵"];

  // game state
  let pairCount = 6; // default pairs (easy)
  let moves = 0;
  let matches = 0;
  let firstCard = null;
  let secondCard = null;
  let boardLocked = false;
  let deck = []; // array of emojis (pairs)

  // helper utilities
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function buildDeck(pairs) {
    const selected = [];
    for (let i = 0; i < pairs; i++) {
      selected.push(cardEmojis[i % cardEmojis.length]);
    }
    const d = [...selected, ...selected];
    return shuffle(d);
  }

  function renderBoard() {
    // clear board
    gameBoard.innerHTML = "";
    // create card elements
    deck.forEach((emoji, idx) => {
      const card = document.createElement("button"); // button so it's keyboard focusable
      card.className = "card";
      card.type = "button";
      card.dataset.emoji = emoji;
      card.dataset.index = idx;
      card.setAttribute("aria-label", "Memory card");
      card.innerHTML = `
        <div class="card-front">?</div>
        <div class="card-back">${emoji}</div>
      `;
      // attach handler
      card.addEventListener("click", handleCardClick);
      // append
      gameBoard.appendChild(card);
    });

    // set grid columns depending on difficulty
    gameBoard.style.gridTemplateColumns = pairCount === 6 ? "repeat(4, 1fr)" : "repeat(6, 1fr)";
  }

  function resetGameState() {
    moves = 0;
    matches = 0;
    firstCard = null;
    secondCard = null;
    boardLocked = false;
    if (movesEl) movesEl.textContent = moves;
    if (matchesEl) matchesEl.textContent = matches;
    if (winMessage) winMessage.textContent = "";
  }

  function startNewGame() {
    // set pairCount from difficulty select
    const diff = difficultySelect.value;
    pairCount = diff === "hard" ? 12 : 6;

    // build deck and render
    deck = buildDeck(pairCount);
    resetGameState();
    renderBoard();
  }

  function handleCardClick(e) {
    if (boardLocked) return;
    const clicked = e.currentTarget;
    // ignore clicks on already matched cards
    if (clicked.classList.contains("matched")) return;
    // ignore clicking same card twice
    if (firstCard && clicked === firstCard) return;

    // flip
    clicked.classList.add("flipped");

    if (!firstCard) {
      firstCard = clicked;
      return;
    }

    // second card
    secondCard = clicked;
    // increment moves
    moves++;
    if (movesEl) movesEl.textContent = moves;

    // check match
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    if (isMatch) {
      // mark matched
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matches++;
      if (matchesEl) matchesEl.textContent = matches;
      // clear selection
      firstCard = null;
      secondCard = null;

      // check win
      if (matches === pairCount) {
        // small delay to let last flip show
        setTimeout(() => {
          if (winMessage) winMessage.textContent = "🎉 You won!";
          showPopup("You completed the Memory Game!");
        }, 300);
      }
    } else {
      // not match: flip back after delay
      boardLocked = true;
      setTimeout(() => {
        if (firstCard) firstCard.classList.remove("flipped");
        if (secondCard) secondCard.classList.remove("flipped");
        firstCard = null;
        secondCard = null;
        boardLocked = false;
      }, 1000);
    }
  }

  // Attach control listeners
  difficultySelect.addEventListener("change", startNewGame);
  startBtn.addEventListener("click", startNewGame);
  restartBtn.addEventListener("click", startNewGame);

  // init first board
  startNewGame();
});
