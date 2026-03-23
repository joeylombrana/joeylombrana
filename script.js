document.addEventListener("DOMContentLoaded", () => {
  const yearEls = document.querySelectorAll("#year");
  yearEls.forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const flipCards = document.querySelectorAll(".flip-card");
  flipCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
  });

  const reviewForm = document.getElementById("reviewForm");
  const thankYouMessage = document.getElementById("thankYouMessage");

  if (!reviewForm || !thankYouMessage) return;

  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const honeypot = document.getElementById("website");
    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    const consent = document.getElementById("consent");
    const consentGiven = !!(consent && consent.checked);

    const turnstileResponse = reviewForm.querySelector('[name="cf-turnstile-response"]');
    if (!turnstileResponse || !turnstileResponse.value) {
      alert("Please complete the security check.");
      return;
    }

    let timeField = reviewForm.querySelector('input[name="time"]');
    if (!timeField) {
      timeField = document.createElement("input");
      timeField.type = "hidden";
      timeField.name = "time";
      reviewForm.appendChild(timeField);
    }

    const now = new Date();
    timeField.value = now.toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short"
    });

    let consentField = reviewForm.querySelector('input[name="consentStatus"]');
    if (!consentField) {
      consentField = document.createElement("input");
      consentField.type = "hidden";
      consentField.name = "consentStatus";
      reviewForm.appendChild(consentField);
    }

    consentField.value = consentGiven ? "Yes" : "No";

    const checkedServices = Array.from(
      reviewForm.querySelectorAll('input[name="services"]:checked')
    ).map((el) => el.value);

    let servicesField = reviewForm.querySelector('input[data-generated="true"]');
    if (!servicesField) {
      servicesField = document.createElement("input");
      servicesField.type = "hidden";
      servicesField.name = "services";
      servicesField.setAttribute("data-generated", "true");
      reviewForm.appendChild(servicesField);
    }

    servicesField.value = checkedServices.join(", ");

    const sheetPayload = {
      timestamp: timeField.value,
      full_name: reviewForm.querySelector('[name="name"]').value,
      phone: reviewForm.querySelector('[name="phone"]').value,
      email: reviewForm.querySelector('[name="email"]').value,
      address: reviewForm.querySelector('[name="address"]').value,
      balance: reviewForm.querySelector('[name="balance"]').value,
      payment: reviewForm.querySelector('[name="payment"]').value,
      beneficiary: reviewForm.querySelector('[name="beneficiary"]').value,
      beneficiary_contact: reviewForm.querySelector('[name="beneficiaryContact"]').value,
      services: servicesField.value,
      consent_status: consentField.value,
      source_page: "contact.html"
    };

    try {
      const leadResult = await emailjs.sendForm(
        "service_0dkwo5q",
        "template_iq3xy0t",
        reviewForm
      );
      console.log("Lead email sent:", leadResult);

      const autoReplyResult = await emailjs.sendForm(
        "service_0dkwo5q",
        "template_5v8hjjl",
        reviewForm
      );
      console.log("Auto-reply sent:", autoReplyResult);

     await fetch(
  "https://script.google.com/macros/s/AKfycbzVy9ar4nlo3GQWMOrh1ae4AjVs9tTzIxQrlnG3P4-Drn8QP2DY0h7JwKbJuyxiBprM/exec",
  {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(sheetPayload)
  }
);

console.log("Lead sent to Google Sheets webhook.");
      );

      console.log("Lead sent to Google Sheets webhook.");

      reviewForm.classList.add("hidden");
      thankYouMessage.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });

      reviewForm.reset();
      servicesField.value = "";
      timeField.value = "";
      consentField.value = "";

      if (window.turnstile) {
        window.turnstile.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert(`Error: ${error?.text || error?.message || JSON.stringify(error)}`);
    }
  });
});
