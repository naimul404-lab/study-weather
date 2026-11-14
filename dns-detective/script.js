const stages = [
  { title: "Your device checks its notes", icon: "▣", badge: "CLUE 01 · LOCAL", text: "Before asking the wider internet, your browser and operating system may check their DNS caches. If a valid answer is already saved, the lookup can finish here.", message: "No cached answer in this simplified investigation, so the question moves to a recursive resolver.", actor: "Browser + OS cache" },
  { title: "The resolver takes the case", icon: "↗", badge: "CLUE 02 · RECURSIVE", text: "A recursive DNS resolver is the service your device asks for help. It finds the answer on your behalf, contacting other DNS servers if needed.", message: "The resolver coordinates the lookup and temporarily caches answers according to their TTL.", actor: "Recursive resolver" },
  { title: "The root points to a direction", icon: "◉", badge: "CLUE 03 · ROOT", text: "The resolver asks a root DNS server where to find information about the domain’s top-level domain, such as .com. The root does not usually provide the website’s address.", message: "The root refers the resolver to the DNS servers responsible for the requested TLD.", actor: "Root DNS server" },
  { title: "The TLD narrows the search", icon: "◎", badge: "CLUE 04 · TLD", text: "The TLD nameserver (for example, the one for .com) points the resolver toward the domain’s authoritative nameserver.", message: "A referral identifies which authoritative nameserver can answer for this domain.", actor: "TLD nameserver" },
  { title: "The authoritative server answers", icon: "⌂", badge: "CLUE 05 · ANSWER", text: "The authoritative nameserver holds DNS records for the domain. It returns the requested record type; the resolver can then send the answer back to your device.", message: "Case closed: a simulated A record is ready. This example was generated locally—not looked up live.", actor: "Authoritative nameserver" },
];

const form = document.getElementById("lookupForm");
const input = document.getElementById("domainInput");
const errorMessage = document.getElementById("errorMessage");
const traceButton = document.getElementById("traceButton");
const routeNodes = [...document.querySelectorAll(".route-node")];
let domain = "";
let currentStep = -1;
let timer = null;

function cleanDomain(raw) {
  let value = raw.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "").split(/[/?#]/)[0].replace(/\.$/, "");
  if (!value || value.length > 253 || !value.includes(".")) return null;
  const labels = value.split(".");
  const valid = labels.every((label) => label.length > 0 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label));
  return valid ? value : null;
}

function sampleAddress(name) {
  // Documentation-only IP range; this is intentionally not a live DNS answer.
  const hash = [...name].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
  return `203.0.113.${(hash % 250) + 1}`;
}

function setStep(step) {
  currentStep = step;
  const clue = stages[step];
  document.getElementById("clueBadge").textContent = clue.badge;
  document.getElementById("clueNumber").textContent = `${String(step + 1).padStart(2, "0")} / 05`;
  document.getElementById("clueIcon").textContent = clue.icon;
  document.getElementById("clueTitle").textContent = clue.title;
  document.getElementById("clueText").textContent = clue.text;
  document.getElementById("clueMessage").textContent = clue.message;
  document.getElementById("progressText").textContent = `${step + 1} of 5 clues discovered`;
  document.getElementById("progressBar").style.width = `${((step + 1) / stages.length) * 100}%`;
  document.getElementById("routeLineFill").style.width = `${(step / (stages.length - 1)) * 100}%`;
  document.getElementById("previousButton").disabled = step === 0;
  document.getElementById("nextButton").disabled = step === stages.length - 1;
  document.getElementById("nextButton").textContent = step === stages.length - 1 ? "Case complete ✓" : "Next clue →";
  routeNodes.forEach((node, index) => {
    node.classList.toggle("visited", index <= step);
    node.classList.toggle("selected", index === step);
    node.setAttribute("aria-current", index === step ? "step" : "false");
  });
  const answerCard = document.getElementById("answerCard");
  answerCard.hidden = step !== stages.length - 1;
  if (!answerCard.hidden) {
    document.getElementById("answerTitle").textContent = `Address record for ${domain}`;
    document.getElementById("answerDescription").textContent = `The simulated authoritative server returned this example A record. It is not a real DNS lookup.`;
    document.getElementById("answerRecord").textContent = `A  ${sampleAddress(domain)}`;
  }
}

function startInvestigation(value) {
  if (timer) window.clearInterval(timer);
  domain = value;
  currentStep = -1;
  document.getElementById("routeDomain").textContent = domain.toUpperCase();
  document.getElementById("answerCard").hidden = true;
  routeNodes.forEach((node) => { node.classList.remove("visited", "selected"); node.setAttribute("aria-current", "false"); });
  document.getElementById("progressText").textContent = "Investigation in progress";
  document.getElementById("progressBar").style.width = "0%";
  document.getElementById("routeLineFill").style.width = "0%";
  traceButton.disabled = true;
  traceButton.querySelector("span").textContent = "Tracing…";
  setStep(0);
  timer = window.setInterval(() => {
    if (currentStep >= stages.length - 1) {
      window.clearInterval(timer);
      timer = null;
      traceButton.disabled = false;
      traceButton.querySelector("span").textContent = "Trace again";
      return;
    }
    setStep(currentStep + 1);
  }, 950);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const validDomain = cleanDomain(input.value);
  if (!validDomain) {
    errorMessage.hidden = false;
    errorMessage.textContent = "Enter a valid domain, such as example.com.";
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  errorMessage.hidden = true;
  input.removeAttribute("aria-invalid");
  startInvestigation(validDomain);
});

document.querySelectorAll("[data-domain]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.domain;
    input.focus();
  });
});

document.getElementById("nextButton").addEventListener("click", () => {
  if (currentStep < stages.length - 1) setStep(currentStep + 1);
});
document.getElementById("previousButton").addEventListener("click", () => {
  if (currentStep > 0) setStep(currentStep - 1);
});
routeNodes.forEach((node, index) => {
  node.setAttribute("role", "button");
  node.setAttribute("tabindex", "0");
  node.addEventListener("click", () => { if (currentStep >= 0 && index <= currentStep) setStep(index); });
  node.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && currentStep >= 0 && index <= currentStep) {
      event.preventDefault();
      setStep(index);
    }
  });
});
