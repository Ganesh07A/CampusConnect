let allFetchedEvents = []; // Store all fetched events globally
let allFetchedPapers = []; // Store all fetched papers globally

// Navigation functionality
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        console.warn(`Section with id '${sectionId}' not found. Defaulting to dashboard.`);
        const dashboardSection = document.getElementById('dashboard');
        if (dashboardSection) dashboardSection.classList.add('active');
    }
}

// Event registration function
function registerForEvent(eventId) {
    alert(`Registration for event ${eventId} would be handled here. This is a demo.`);
}

// Event card creation
function createEventCard(event) {
    const speakerInfo = event.speaker ? `<span><strong>Speaker:</strong> ${event.speaker}</span>` : '';
    const categoryDisplay = event.category ? event.category : 'General';
    const eventId = event.id || event.title.replace(/\s+/g, '-').toLowerCase(); 

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

// Load events from the server
function loadEvents() {
    fetch('http://localhost:3000/api/events')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            allFetchedEvents = data; 

            const dashboardEventsContainer = document.getElementById('events-container'); 
            const allEventsPageContainer = document.getElementById('all-events'); 

            if (dashboardEventsContainer) {
                dashboardEventsContainer.innerHTML = allFetchedEvents.slice(0, 3).map(createEventCard).join(''); 
            }

            if (allEventsPageContainer) {
                allEventsPageContainer.innerHTML = allFetchedEvents.map(createEventCard).join('');
            }
            
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) {
                if (!categoryFilter.dataset.listenerAttached) {
                    categoryFilter.addEventListener('change', () => displayFilteredEvents(allFetchedEvents));
                    categoryFilter.dataset.listenerAttached = 'true';
                }
            }
        })
        .catch(error => {
            console.error("Failed to load events:", error);
            const eventsContainers = [document.getElementById('events-container'), document.getElementById('all-events')];
            eventsContainers.forEach(container => {
                if (container) container.innerHTML = "<p>Could not load events. Please try again later.</p>";
            });
        });
}

// Filter and display events on the Events page
function displayFilteredEvents(eventsToFilter) {
    const category = document.getElementById('category-filter').value;
    const filteredEvents = category === 'all'
        ? eventsToFilter
        : eventsToFilter.filter(event => event.category && event.category.toLowerCase() === category.toLowerCase());

    const allEventsPageContainer = document.getElementById('all-events');
    if (allEventsPageContainer) {
        if (filteredEvents.length > 0) {
            allEventsPageContainer.innerHTML = filteredEvents.map(createEventCard).join('');
        } else {
            allEventsPageContainer.innerHTML = "<p>No events found for this category.</p>";
        }
    }
}

// News card creation
function createNewsCard(newsItem) {
    return `
        <div class="news-card">
            <h3>${newsItem.title}</h3>
            <p class="date">Published: ${newsItem.date}</p>
            <p>${newsItem.content}</p>
        </div>
    `;
}

// Load news from the server
function loadNews() {
    fetch('http://localhost:3000/api/news')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            const newsContainer = document.getElementById('news-container');
            if (newsContainer) {
                if (data.length > 0) {
                    newsContainer.innerHTML = data.map(createNewsCard).join('');
                } else {
                    newsContainer.innerHTML = "<p>No news available at the moment.</p>";
                }
            }
        })
        .catch(error => {
            console.error("Failed to load news:", error);
            const newsContainer = document.getElementById('news-container');
            if(newsContainer) newsContainer.innerHTML = "<p>Could not load news. Please try again later.</p>";
        });
}

// Council member card creation
function createCouncilMemberCard(member) {
    return `
        <div class="council-member-card">
            <h3>${member.name}</h3>
            <p class="role">${member.role}</p>
            <p>Contact: ${member.phone || 'N/A'}</p>
        </div>
    `;
}

// Load student council info from the server
function loadCouncilInfo() {
    fetch('http://localhost:3000/api/council')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            const councilContainer = document.getElementById('council-container');
            if (councilContainer) {
                 if (data.length > 0) {
                    councilContainer.innerHTML = data.map(createCouncilMemberCard).join('');
                } else {
                    councilContainer.innerHTML = "<p>Student council information is not available.</p>";
                }
            }
        })
        .catch(error => {
            console.error("Failed to load student council info:", error);
            const councilContainer = document.getElementById('council-container');
            if(councilContainer) councilContainer.innerHTML = "<p>Could not load council information. Please try again later.</p>";
        });
}

// Paper card creation
function createPaperCard(paper) {
    const filePath = `papers/${paper.file}`; 
    const studentYearInfo = paper.studentYear ? `<p><strong>Student Year Level:</strong> ${paper.studentYear}</p>` : '';

    return `
        <div class="paper-card">
            <h4>${paper.subject}</h4>
            <p><strong>Type:</strong> ${paper.type}</p>
            <p><strong>Exam Year:</strong> ${paper.year}</p>
            ${studentYearInfo}
            <a href="${filePath}" target="_blank" class="paper-download-link">Download Paper</a>
        </div>
    `;
}

// Load papers from the server
function loadPapers() {
    fetch('http://localhost:3000/api/papers')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            allFetchedPapers = data; 

            const papersContainer = document.getElementById('papers-container');
            if (papersContainer) {
                if (allFetchedPapers.length > 0) {
                    papersContainer.innerHTML = allFetchedPapers.map(createPaperCard).join('');
                } else {
                    papersContainer.innerHTML = "<p>No exam papers available at the moment.</p>";
                }
            }
            
            // Add year level filter functionality
            const yearFilter = document.getElementById('year-level-filter');
            if (yearFilter && !yearFilter.dataset.listenerAttached) {
                yearFilter.addEventListener('change', () => displayFilteredPapers(allFetchedPapers));
                yearFilter.dataset.listenerAttached = 'true';
            }
        })
        .catch(error => {
            console.error("Failed to load exam papers:", error);
            const papersContainer = document.getElementById('papers-container');
            if(papersContainer) papersContainer.innerHTML = "<p>Could not load exam papers. Please try again later.</p>";
        });
}

// Filter papers by year level
function displayFilteredPapers(papersToFilter) {
    const yearLevel = document.getElementById('year-level-filter').value;
    const filteredPapers = yearLevel === 'all'
        ? papersToFilter
        : papersToFilter.filter(paper => paper.studentYear && paper.studentYear.toString() === yearLevel);

    const papersContainer = document.getElementById('papers-container');
    if (papersContainer) {
        if (filteredPapers.length > 0) {
            papersContainer.innerHTML = filteredPapers.map(createPaperCard).join('');
        } else {
            papersContainer.innerHTML = "<p>No papers found for this year level.</p>";
        }
    }
}

// Hiring card creation
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

// Load hiring information
function loadHiring() {
    fetch('http://localhost:3000/api/hiring')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            const hiringContainer = document.getElementById('hiring-container');
            if (hiringContainer) {
                if (data.length > 0) {
                    hiringContainer.innerHTML = data.map(createHiringCard).join('');
                } else {
                    hiringContainer.innerHTML = "<p>No job opportunities available at the moment.</p>";
                }
            }
        })
        .catch(error => {
            console.error("Failed to load hiring information:", error);
            const hiringContainer = document.getElementById('hiring-container');
            if(hiringContainer) hiringContainer.innerHTML = "<p>Could not load hiring information. Please try again later.</p>";
        });
}

// Apply for job function
function applyForJob(company, position) {
    alert(`Application for ${position} at ${company}. thanks for applying. This is a demo.`);
}

// Feedback form submission
function handleFeedbackSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const feedbackData = {
        name: formData.get('feedbackName'),
        email: formData.get('feedbackEmail'),
        type: formData.get('feedbackType'),
        message: formData.get('feedbackMessage')
    };
    
    // In a real application, you would send this to your server
    console.log('Feedback submitted:', feedbackData);
    alert('Thank you for your feedback! We appreciate your input.');
    
    // Reset the form
    event.target.reset();
}

// Navigation event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to navigation links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Add feedback form submission handler
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmission);
    }
    
    // Load all data when page loads
    loadEvents();
    loadNews();
    loadCouncilInfo();
    loadPapers();
    loadHiring();
    
    // Show dashboard by default
    showSection('dashboard');
});