document.addEventListener("DOMContentLoaded", () => {
  const agentForm = document.getElementById("agentForm");
  const thankYouMessage = document.getElementById("agentThankYouMessage");

  if (!agentForm || !thankYouMessage) return;

  agentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🛑 Honeypot (spam protection)
    const honeypot = document.getElementById("agent-website");
    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    // ⏱ Timestamp
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

    // ✅ Consent tracking
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
      // 🔥 1. Send notification to YOU
      await emailjs.sendForm(
        "service_0dkwo5q",
        "template_10lb5or", // New Agent Setup Request
        agentForm
      );

      // 🔥 2. Send auto-reply to AGENT
      await emailjs.sendForm(
        "service_0dkwo5q",
        "template_82ynf2v", // Your Setup Request Has Been Received
        agentForm
      );

      // ✅ 3. UI update AFTER emails send
      agentForm.classList.add("hidden");
      thankYouMessage.classList.remove("hidden");

      window.scrollTo({ top: 0, behavior: "smooth" });

      // 🔄 Reset form
      agentForm.reset();
      timeField.value = "";
      consentField.value = "";

    } catch (error) {
      console.error("EmailJS error full object:", error);
      alert(`Email error: ${error?.text || error?.message || JSON.stringify(error)}`);
    }
  });
});
