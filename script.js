// script.js without server.js — loads data.json directly and handles everything client-side

let allFetchedEvents = [];
let allFetchedPapers = [];
let allFetchedNews = [];
let allCouncilMembers = [];
let allHiringData = [];


// Navigation functionality
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  } else {
    const dashboardSection = document.getElementById("dashboard");
    if (dashboardSection) dashboardSection.classList.add("active");
  }
}

function registerForEvent(eventId) {
  alert("Registration for event ${eventId} is noted. This is a demo.");
}

function createEventCard(event) {
  const speakerInfo = event.speaker
    ? `<span><strong>Speaker:</strong> ${event.speaker}</span>`
    : "";
  const categoryDisplay = event.category ? event.category : "General";
  const eventId = event.id || event.title.replace(/\s+/g, "-").toLowerCase();

  return `
    <div class="event-card">
      <div class="event-image">
        <span class="event-category">${categoryDisplay}</span>
      </div>
      <div class="event-content">
        <h3 class="event-title">${event.title}</h3>
        <p class="event-description">${event.description}</p>
        <div class="event-details">
          ${speakerInfo}
          <span><strong>Date:</strong> ${event.date}</span>
          <span><strong>Time:</strong> ${event.time}</span>
          <span><strong>Location:</strong> ${event.location}</span>
        </div>
        <button class="register-btn" onclick="registerForEvent('${eventId}')">
          Register Now
        </button>
      </div>
    </div>
  `;
}

function displayFilteredEvents(eventsToFilter) {
  const category = document.getElementById("category-filter").value;
  const filteredEvents =
    category === "all"
      ? eventsToFilter
      : eventsToFilter.filter(
          (event) =>
            event.category &&
            event.category.toLowerCase() === category.toLowerCase()
        );

  const container = document.getElementById("all-events");
  if (filteredEvents.length > 0) {
    container.innerHTML = filteredEvents.map(createEventCard).join("");
  } else {
    container.innerHTML = "<p>No events found for this category.</p>";
  }
}

function createNewsCard(news) {
  return `
    <div class="news-card">
      <h3>${news.title}</h3>
      <p class="date">Published: ${news.date}</p>
      <p>${news.content}</p>
    </div>
  `;
}

function createCouncilMemberCard(member) {
  return `
    <div class="council-member-card">
      <h3>${member.name}</h3>
      <p class="role">${member.role}</p>
      <p>Contact: ${member.phone || "N/A"}</p>
    </div>
  `;
}

function createPaperCard(paper) {
  const filePath = `${paper.file}`;
  return `
    <div class="paper-card">
      <h4>${paper.subject}</h4>
      <p><strong>Type:</strong> ${paper.type}</p>
      <p><strong>Exam Year:</strong> ${paper.year}</p>
      <a href="${filePath}" target="_blank" class="paper-download-link">Download Paper</a>
    </div>
  `;
}

function displayFilteredPapers(papersToFilter) {
  const yearLevel = document.getElementById("year-level-filter").value;
  const filteredPapers =
    yearLevel === "all"
      ? papersToFilter
      : papersToFilter.filter(
          (paper) =>
            paper.studentYear &&
            paper.studentYear.toString() === yearLevel
        );

  const container = document.getElementById("papers-container");
  if (filteredPapers.length > 0) {
    container.innerHTML = filteredPapers.map(createPaperCard).join("");
  } else {
    container.innerHTML = "<p>No papers found for this year level.</p>";
  }
}

function createHiringCard(job) {
  return `
    <div class="hiring-card">
      <h3>${job.position}</h3>
      <h4>${job.company}</h4>
      <p><strong>Date:</strong> ${job.date}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p>${job.description}</p>
      <button class="apply-btn" onclick="applyForJob('${job.company}', '${job.position}')">
        Apply Now
      </button>
    </div>
  `;
}

function applyForJob(company, position) {
  alert(`Application for ${position} at ${company} submitted. This is a demo.`);
}

function handleFeedbackSubmission(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const feedbackData = {
    name: formData.get("feedbackName"),
    email: formData.get("feedbackEmail"),
    type: formData.get("feedbackType"),
    message: formData.get("feedbackMessage"),
  };
  console.log("Feedback submitted:", feedbackData);
  alert("Thank you for your feedback!");
  event.target.reset();
}

function loadData() {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      allFetchedEvents = data.events || [];
      allFetchedPapers = data.papers || [];
      allFetchedNews = data.news || [];
      allCouncilMembers = data.council || [];
      allHiringData = data.hiring || [];

      // Display Events
      const dashboardEventsContainer = document.getElementById("events-container");
      const allEventsContainer = document.getElementById("all-events");
      dashboardEventsContainer.innerHTML = allFetchedEvents.slice(0, 3).map(createEventCard).join("");
      allEventsContainer.innerHTML = allFetchedEvents.map(createEventCard).join("");

      const categoryFilter = document.getElementById("category-filter");
      categoryFilter.addEventListener("change", () => displayFilteredEvents(allFetchedEvents));

      // Display News
      document.getElementById("news-container").innerHTML = allFetchedNews.map(createNewsCard).join("");

      // Display Council
      document.getElementById("council-container").innerHTML = allCouncilMembers.map(createCouncilMemberCard).join("");

      // Display Papers
      document.getElementById("papers-container").innerHTML = allFetchedPapers.map(createPaperCard).join("");

      const yearFilter = document.getElementById("year-level-filter");
      yearFilter.addEventListener("change", () => displayFilteredPapers(allFetchedPapers));

      // Display Hiring
      document.getElementById("hiring-container").innerHTML = allHiringData.map(createHiringCard).join("");
    })
    .catch((error) => {
      console.error("Failed to load data.json:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showSection(this.getAttribute("href").substring(1));
    });
  });

  document.getElementById("feedbackForm")?.addEventListener("submit", handleFeedbackSubmission);

  loadData();
  showSection("dashboard");
});
