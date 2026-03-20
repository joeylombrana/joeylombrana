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
    if (!consent || !consent.checked) {
      alert("Please review and accept the contact consent before submitting.");
      return;
    }

    const turnstileResponse = reviewForm.querySelector('[name="cf-turnstile-response"]');
    if (!turnstileResponse || !turnstileResponse.value) {
      alert("Please complete the security check.");
      return;
    }

    // Add timestamp for EmailJS
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

    // Combine checked services into one field for EmailJS
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

    try {
      const leadResult = await emailjs.sendForm(
        "Service_0dkwo5q",
        "Template_iq3xy0t",
        reviewForm
      );
      console.log("Lead email sent:", leadResult);

      const autoReplyResult = await emailjs.sendForm(
        "Service_0dkwo5q",
        "template_5v8hjjl",
        reviewForm
      );
      console.log("Auto-reply sent:", autoReplyResult);

      reviewForm.classList.add("hidden");
      thankYouMessage.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });

      reviewForm.reset();
      servicesField.value = "";
      timeField.value = "";

      if (window.turnstile) {
        window.turnstile.reset();
      }
    } catch (error) {
      console.error("EmailJS error full object:", error);
      alert(`Email error: ${error?.text || error?.message || JSON.stringify(error)}`);
    }
  });
});