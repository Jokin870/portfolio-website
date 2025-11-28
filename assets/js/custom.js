document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const results = document.getElementById("formResults");

  if (!form) {
    console.error("❌ Form with ID 'contactForm' not found");
    return;
  }

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
    results.innerHTML += `<span id="ratingAvg" style="color:${color}; font-weight:bold;">${avg}</span>`;

    showPopup("Form submitted successfully!");
  });
});

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
