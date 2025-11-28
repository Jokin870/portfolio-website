// Contact form handler
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const resultsDiv = document.getElementById("formResults");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent reload

    // Collect values
    const formData = {
      name: document.getElementById("name").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      rating1: Number(document.getElementById("rating1").value),
      rating2: Number(document.getElementById("rating2").value),
      rating3: Number(document.getElementById("rating3").value)
    };

    // Print to console
    console.log(formData);

    // Display results below form
    resultsDiv.innerHTML = `
Name: ${formData.name}<br>
Surname: ${formData.surname}<br>
Email: ${formData.email}<br>
Phone number: ${formData.phone}<br>
Address: ${formData.address}<br>
`;

    // Calculate average rating
    const avg = ((formData.rating1 + formData.rating2 + formData.rating3) / 3).toFixed(1);

    // Determine color
    let color = "red";
    if (avg >= 4 && avg < 7) color = "orange";
    if (avg >= 7) color = "green";

    // Display average with color + format
    resultsDiv.innerHTML += `<strong>${formData.name} ${formData.surname}: <span id="ratingAvg" style="color:${color}">${avg}</span></strong>`;

    // Show success popup
    showPopup("Form submitted successfully!");
  });
});

// Success popup function
function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "custom-popup";
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 50);
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}
