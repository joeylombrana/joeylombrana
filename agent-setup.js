document.addEventListener("DOMContentLoaded", () => {
  const agentForm = document.getElementById("agentForm");
  const thankYouMessage = document.getElementById("agentThankYouMessage");

  if (!agentForm || !thankYouMessage) return;

  agentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const honeypot = document.getElementById("agent-website");
    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    let timeField = agentForm.querySelector('input[name="time"]');
    if (!timeField) {
      timeField = document.createElement("input");
      timeField.type = "hidden";
      timeField.name = "time";
      agentForm.appendChild(timeField);
    }

    timeField.value = new Date().toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short"
    });

    let consentField = agentForm.querySelector('input[name="consentStatus"]');
    if (!consentField) {
      consentField = document.createElement("input");
      consentField.type = "hidden";
      consentField.name = "consentStatus";
      agentForm.appendChild(consentField);
    }

    const consent = document.getElementById("agent-consent");
    consentField.value = consent && consent.checked ? "Yes" : "No";

    try {
      await emailjs.sendForm(
        "service_0dkwo5q",
        "template_iq3xy0t",
        agentForm
      );

      agentForm.classList.add("hidden");
      thankYouMessage.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });

      agentForm.reset();
      timeField.value = "";
      consentField.value = "";
    } catch (error) {
      console.error("EmailJS error full object:", error);
      alert(`Email error: ${error?.text || error?.message || JSON.stringify(error)}`);
    }
  });
});