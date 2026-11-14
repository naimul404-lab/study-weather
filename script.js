const weatherProfiles = [
  {
    title: "Sunny learning window",
    description:
      "Your focus is strong and your energy is rising. This is a great time for deep work and high-impact tasks.",
    energy: 82,
    focus: 78,
    load: "Low",
    icon: "☀️",
    tasks: [
      "Deep dive: 45 min of high-priority concept work",
      "Practice: 20 min solving a focused problem",
      "Review: 10 min recap and cleanup",
    ],
  },
  {
    title: "Cloudy but steady",
    description:
      "Your brain is engaged, but the day needs a little more structure. Aim for clear, measurable study blocks.",
    energy: 64,
    focus: 68,
    load: "Medium",
    icon: "⛅",
    tasks: [
      "Revision: 30 min of structured notes and summaries",
      "Reading: 20 min on a new topic",
      "Flashcards: 10 min retrieval practice",
    ],
  },
  {
    title: "Rainy energy",
    description:
      "You may be tired or mentally overloaded. Keep tasks light and finishable so progress stays sustainable.",
    energy: 46,
    focus: 52,
    load: "Moderate",
    icon: "🌧️",
    tasks: [
      "Low-load review: 15 min reading",
      "Practice: 10 min quick drills",
      "Recovery: 20 min reset + reflection",
    ],
  },
  {
    title: "Storm front",
    description:
      "This is not the day for heavy lifting. Protect your attention and reduce decision fatigue with smaller wins.",
    energy: 28,
    focus: 34,
    load: "High",
    icon: "⛈️",
    tasks: [
      "Reset: 10 min breathing and planning",
      "Simple task: 15 min admin or easy review",
      "Stop: Give yourself a meaningful break",
    ],
  },
];

const playState = () => {
  const weather = weatherProfiles[Math.floor(Math.random() * weatherProfiles.length)];

  document.getElementById("skyIcon").textContent = weather.icon;
  document.getElementById("weatherTitle").textContent = weather.title;
  document.getElementById("weatherDescription").textContent = weather.description;
  document.getElementById("energyValue").textContent = `${weather.energy}%`;
  document.getElementById("focusValue").textContent = `${weather.focus}%`;
  document.getElementById("loadValue").textContent = weather.load;

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  weather.tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task;
    taskList.appendChild(li);
  });
};

document.getElementById("checkWeatherBtn").addEventListener("click", playState);
playState();
