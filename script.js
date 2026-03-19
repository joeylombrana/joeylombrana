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

  if (reviewForm && thankYouMessage) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const honeypot = document.getElementById("website");
      if (honeypot && honeypot.value.trim() !== "") {
        return;
      }

      reviewForm.classList.add("hidden");
      thankYouMessage.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});