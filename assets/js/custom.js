document.addEventListener("DOMContentLoaded", () => {

  // -------- CONTACT FORM (no tocar, sigue igual) --------
  const form = document.getElementById("contactForm");
  const results = document.getElementById("formResults");

  if (form && results) {
      form.addEventListener("submit", (e) => {
          e.preventDefault();

          const data = {
              name: document.getElementById("name").value,
              surname: document.getElementById("surname").value,
              email: document.getElementById("email").value,
              phone: document.getElementById("phone").value,
              address: document.getElementById("address").value,
              rating1: Number(document.getElementById("rating1").value),
              rating2: Number(document.getElementById("rating2").value),
              rating3: Number(document.getElementById("rating3").value)
          };

          let output = "";
          output += `Name: ${data.name}\n`;
          output += `Surname: ${data.surname}\n`;
          output += `Email: ${data.email}\n`;
          output += `Phone number: ${data.phone}\n`;
          output += `Address: ${data.address}\n`;

          const avg = ((data.rating1 + data.rating2 + data.rating3) / 3).toFixed(1);
          let color = "red";
          if (avg >= 4 && avg < 7) color = "orange";
          if (avg >= 7 && avg <= 10) color = "green";

          results.textContent = output;
          results.innerHTML += `<br>`;
          results.innerHTML += `${data.name} ${data.surname}: <span style="color:${color}; font-weight:bold;">${avg}</span>`;
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

  // -------- RATING SLIDERS EN TIEMPO REAL --------
  const ratingSliders = [1,2,3];
  ratingSliders.forEach(i => {
    const slider = document.getElementById(`rating${i}`);
    const span = document.getElementById(`rating${i}Val`);
    if(slider && span){
      span.textContent = slider.value;
      slider.addEventListener("input", () => {
        span.textContent = slider.value;
      });
    }
  });

  // -------- SMART THERMOMETER --------
  const tempSlider = document.getElementById("tempSlider");
  const tempDisplay = document.getElementById("tempDisplay");
  const tempEmoji = document.getElementById("tempEmoji");
  const tempStatus = document.getElementById("tempStatus");

  function updateThermometer() {
    const val = Number(tempSlider.value);
    tempDisplay.textContent = val + "°C";

    if(val < 10){
      tempEmoji.textContent = "❄️";
      tempStatus.textContent = "Cold 🥶";
    } else if(val <= 25){
      tempEmoji.textContent = "😌";
      tempStatus.textContent = "Comfortable 😌";
    } else if(val <= 35){
      tempEmoji.textContent = "🔥";
      tempStatus.textContent = "Warm 🥵";
    } else {
      tempEmoji.textContent = "☀️";
      tempStatus.textContent = "Hot 🔥";
    }
  }

  if(tempSlider){
    updateThermometer();
    tempSlider.addEventListener("input", updateThermometer);
  }

  // -------- MEMORY GAME (arreglado) --------
  const dataset = ["🌡️","🔥","❄️","💧","⚡","☀️"];
  let difficulty = document.getElementById("mgDifficulty")?.value || "easy";
  let moves = 0;
  let matchedPairs = 0;
  let flipped = [];
  let lock = false;

  const board = document.getElementById("mgBoard");
  const movesSpan = document.getElementById("mgMoves");
  const matchesSpan = document.getElementById("mgMatches");
  const winDiv = document.getElementById("mgWin");
  const diffSelect = document.getElementById("mgDifficulty");
  const startB = document.getElementById("mgStartBtn");
  const restartB = document.getElementById("mgRestartBtn");

  if(diffSelect){
    diffSelect.addEventListener("change", (e) => {
      difficulty = e.target.value;
      initGame();
    });
  }
  startB?.addEventListener("click", initGame);
  restartB?.addEventListener("click", initGame);

  function initGame(){
    moves = 0;
    matchedPairs = 0;
    flipped = [];
    lock = false;
    winDiv.textContent = "";
    movesSpan.textContent = moves;
    matchesSpan.textContent = matchedPairs;
    createBoard();
  }

  function createBoard(){
    board.innerHTML = "";
    const needed = difficulty === "easy" ? 6 : 12;
    const items = [];
    for(let i=0;i<needed;i++) items.push(dataset[i % dataset.length]);
    const cards = [...items, ...items];
    cards.sort(()=>Math.random()-0.5);

    cards.forEach(emoji=>{
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.value = emoji;
      card.innerHTML = `<div class="card-front">?</div><div class="card-back">${emoji}</div>`;
      card.addEventListener("click", ()=>flipCard(card));
      board.appendChild(card);
    });

    board.style.gridTemplateColumns = difficulty==="easy"?"repeat(4,90px)":"repeat(6,90px)";
  }

  function flipCard(card){
    if(lock || flipped.includes(card) || card.classList.contains("matched")) return;
    card.classList.add("flipped");
    flipped.push(card);
    if(flipped.length===2){
      moves++;
      movesSpan.textContent = moves;
      checkPair();
    }
  }

  function checkPair(){
    const [a,b] = flipped;
    if(a.dataset.value===b.dataset.value){
      a.classList.add("matched");
      b.classList.add("matched");
      matchedPairs++;
      matchesSpan.textContent = matchedPairs;
      flipped = [];
      const total = difficulty==="easy"?6:12;
      if(matchedPairs===total) winDiv.textContent="🎉 YOU WON! 🎴🧠";
    } else {
      lock=true;
      setTimeout(()=>{
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        flipped=[];
        lock=false;
      },1000);
    }
  }

  initGame(); // inicializar al cargar
});
