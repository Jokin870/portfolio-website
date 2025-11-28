document.addEventListener("DOMContentLoaded", () => {
  // -------- CONTACT FORM --------
  const form = document.getElementById("contactForm");
  const results = document.getElementById("formResults");

  const rating1 = document.getElementById("rating1");
  const rating2 = document.getElementById("rating2");
  const rating3 = document.getElementById("rating3");
  const rating1Val = document.getElementById("rating1Val");
  const rating2Val = document.getElementById("rating2Val");
  const rating3Val = document.getElementById("rating3Val");

  // Update rating display
  [ [rating1, rating1Val], [rating2, rating2Val], [rating3, rating3Val] ].forEach(([slider, display]) => {
    slider.addEventListener("input", () => display.textContent = slider.value);
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
        rating1: Number(rating1.value),
        rating2: Number(rating2.value),
        rating3: Number(rating3.value)
      };

      console.log("✅ Form Data:", data);

      let output = "";
      Object.keys(data).forEach(key => {
        if (!key.includes("rating")) {
          const label = key === "phone" ? "Phone number" : key.charAt(0).toUpperCase() + key.slice(1);
          output += `${label}: ${data[key]}\n`;
        }
      });

      const avg = ((data.rating1 + data.rating2 + data.rating3) / 3).toFixed(1);

      let color;
      if (avg >= 0 && avg < 4) color = "red";
      if (avg >= 4 && avg < 7) color = "orange";
      if (avg >= 7 && avg <= 10) color = "green";

      output += `${data.name} ${data.surname}: `;
      results.textContent = output;
      results.innerHTML += `<span style="color:${color}; font-weight:bold;">${avg}</span>`;

      showPopup("Form submitted successfully!");
    });
  }

  function showPopup(msg) {
    const p = document.createElement("div");
    p.className = "custom-popup";
    p.textContent = msg;
    document.body.appendChild(p);

    setTimeout(() => p.classList.add("show"), 50);
    setTimeout(() => {
      p.classList.remove("show");
      setTimeout(() => p.remove(), 300);
    }, 3000);
  }

  // -------- MEMORY GAME --------
  const emojis = ["🐶","🐱","🦊","🐼","🐸","🐵"];
  let difficulty = "easy";
  let moves = 0;
  let matches = 0;
  let flippedCards = [];
  let lockBoard = false;

  const gameBoard = document.getElementById("gameBoard");
  const movesEl = document.getElementById("moves");
  const matchesEl = document.getElementById("matches");
  const winMessage = document.getElementById("winMessage");
  const difficultySelect = document.getElementById("difficulty");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");

  difficultySelect.addEventListener("change", (e) => {
    difficulty = e.target.value;
    resetGame();
  });

  startBtn.addEventListener("click", resetGame);
  restartBtn.addEventListener("click", resetGame);

  function resetGame() {
    moves = 0;
    matches = 0;
    flippedCards = [];
    lockBoard = false;
    movesEl.textContent = moves;
    matchesEl.textContent = matches;
    winMessage.textContent = "";
    generateBoard();
  }

  function generateBoard() {
    gameBoard.innerHTML = "";
    let pairCount = difficulty === "easy" ? 6 : 12;
    let selectedEmojis = [];
    while(selectedEmojis.length < pairCount) {
      selectedEmojis.push(emojis[selectedEmojis.length % emojis.length]);
    }
    let cards = [...selectedEmojis, ...selectedEmojis];
    cards.sort(() => Math.random() - 0.5);

    cards.forEach(emoji => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.emoji = emoji;
      card.innerHTML = `<div class="card-front">?</div><div class="card-back">${emoji}</div>`;
      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
    });

    gameBoard.style.gridTemplateColumns = difficulty === "easy" ? "repeat(4, 1fr)" : "repeat(6, 1fr)";
  }

  function flipCard(e) {
    if(lockBoard) return;
    const card = e.currentTarget;
    if(flippedCards.includes(card) || card.classList.contains("matched")) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if(flippedCards.length === 2) {
      moves++;
      movesEl.textContent = moves;
      checkMatch();
    }
  }

  function checkMatch() {
    const [card1, card2] = flippedCards;
    if(card1.dataset.emoji === card2.dataset.emoji) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matches++;
      matchesEl.textContent = matches;
      flippedCards = [];
      if(matches === (difficulty === "easy" ? 6 : 12)) {
        winMessage.textContent = "🎉 You won!";
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }
  }

  resetGame(); // initialize board on page load

  // -------- SMART THERMOMETER --------
  const tempSlider = document.getElementById("tempSlider");
  const tempDisplay = document.getElementById("tempDisplay");
  const tempResult = document.getElementById("tempResult");

  tempSlider.addEventListener("input", () => {
    const temp = tempSlider.value;
    tempDisplay.textContent = temp + "°C";

    let state = "";
    if(temp < 0) state = "Freezing ❄️";
    else if(temp <= 14) state = "Cold 🥶";
    else if(temp <= 24) state = "Comfortable 😌";
    else if(temp <= 34) state = "Warm 🌞";
    else state = "Hot 🔥";

    tempResult.textContent = state;
  });

});
