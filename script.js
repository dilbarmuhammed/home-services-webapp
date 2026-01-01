// --- MOCK DATA ---

const services = [
    { id: 'plumber', name: 'Plumber', icon: '💧' },
    { id: 'electrician', name: 'Electrician', icon: '⚡' },
    { id: 'carpenter', name: 'Carpenter', icon: '🔨' },
    { id: 'painter', name: 'Painter', icon: '🎨' },
    { id: 'mechanic', name: 'Mechanic', icon: '🔧' },
    { id: 'cleaner', name: 'Cleaner', icon: '🧹' },
];

const providers = {
    plumber: [
        { id: 1, name: 'John Doe', skill: 'Gold', rating: 4.8, price: 150 },
        { id: 2, name: 'Mike Ross', skill: 'Silver', rating: 4.5, price: 120 },
        { id: 3, name: 'Jane Smith', skill: 'Bronze', rating: 4.2, price: 90 },
    ],
    electrician: [
        { id: 4, name: 'Sarah Connor', skill: 'Gold', rating: 4.9, price: 200 },
        { id: 5, name: 'Ben Watts', skill: 'Silver', rating: 4.6, price: 160 },
    ],
    carpenter: [
        { id: 6, name: 'Woody Allen', skill: 'Gold', rating: 4.7, price: 180 },
        { id: 7, name: 'Tim Burr', skill: 'Bronze', rating: 4.1, price: 110 },
    ],
    painter: [
        { id: 8, name: 'Leonardo Da Vinci', skill: 'Silver', rating: 4.8, price: 250 },
    ],
    mechanic: [
        { id: 9, name: 'Axel Rod', skill: 'Gold', rating: 4.9, price: 130 },
        { id: 10, name: 'Greta Thunberg', skill: 'Silver', rating: 4.4, price: 100 },
    ],
    cleaner: [
        { id: 11, name: 'Marie Kondo', skill: 'Gold', rating: 5.0, price: 100 },
        { id: 12, name: 'Monica Geller', skill: 'Silver', rating: 4.9, price: 80 },
    ],
};

// --- GLOBAL STATE ---
let currentCategory = null;
let currentProvider = null;

// --- DOM ELEMENTS ---
const pages = document.querySelectorAll('.page');
const serviceCategoriesContainer = document.getElementById('service-categories');
const providersTitle = document.getElementById('providers-title');
const providersListContainer = document.getElementById('providers-list');
const providerBookingCard = document.getElementById('provider-booking-card');
const confirmBookingBtn = document.getElementById('confirm-booking-btn');
const historyListContainer = document.getElementById('history-list');

// --- PAGE NAVIGATION ---

/**
 * Shows a specific page and hides others.
 * @param {string} pageId The ID of the page to show.
 * @param {any} [data] Optional data to pass to the page rendering function.
 */
function showPage(pageId, data) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    const newPage = document.getElementById(pageId);
    if (newPage) {
        newPage.classList.add('active');
        // Scroll to top on page change
        window.scrollTo(0, 0);

        // Call render functions for specific pages
        if (pageId === 'providers-page' && data) {
            currentCategory = data;
            renderProviders(data);
        } else if (pageId === 'booking-page' && data) {
            currentProvider = data;
            renderBookingPage(data);
        } else if (pageId === 'history-page') {
            renderHistory();
        } else if (pageId === 'landing-page'){
            renderServiceCategories();
        }
    }
}

// --- RENDER FUNCTIONS ---

/**
 * Renders the service category cards on the landing page.
 */
function renderServiceCategories() {
    serviceCategoriesContainer.innerHTML = '';
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'card service-card';
        card.innerHTML = `
            <div class="icon">${service.icon}</div>
            <h3>${service.name}</h3>
        `;
        card.onclick = () => showPage('providers-page', service.id);
        serviceCategoriesContainer.appendChild(card);
    });
}

/**
 * Generates star rating HTML.
 * @param {number} rating The rating value.
 * @returns {string} HTML string for stars.
 */
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return `<span class="rating">${stars} (${rating})</span>`;
}

/**
 * Renders the list of providers for a given category.
 * @param {string} categoryId The ID of the service category.
 */
function renderProviders(categoryId) {
    const service = services.find(s => s.id === categoryId);
    const serviceProviders = providers[categoryId] || [];
    providersTitle.textContent = `${service.name}s`;
    providersListContainer.innerHTML = '';

    if (serviceProviders.length === 0) {
        providersListContainer.innerHTML = '<p>No providers available for this service yet.</p>';
        return;
    }

    serviceProviders.forEach(provider => {
        const card = document.createElement('div');
        card.className = 'card provider-card';
        card.innerHTML = `
            <div class="provider-details">
                <h4>${provider.name}</h4>
                <p>${getStarRating(provider.rating)}</p>
                <div class="verification-badge">
                    <span class="badge ${provider.skill.toLowerCase()}">${provider.skill}</span>
                    <span class="verified-id">Verified ID</span>
                    <span class="bg-checked">Background Checked</span>
                </div>
            </div>
            <p class="price">$${provider.price.toFixed(2)}</p>
            <button class="btn-primary" onclick='showPage("booking-page", ${JSON.stringify(provider)})'>Book Now</button>
        `;
        providersListContainer.appendChild(card);
    });
}

/**
 * Renders the details for the booking page.
 * @param {object} provider The provider object.
 */
function renderBookingPage(provider) {
    providerBookingCard.innerHTML = `
        <h4>${provider.name}</h4>
        <p>${getStarRating(provider.rating)}</p>
        <div class="verification-badge">
            <span class="badge ${provider.skill.toLowerCase()}">${provider.skill}</span>
            <span class="verified-id">Verified ID</span>
            <span class="bg-checked">Background Checked</span>
        </div>
        <p class="price">$${provider.price.toFixed(2)}</p>
    `;
    // Set default date and time
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000).toTimeString().substring(0, 5);

    document.getElementById('booking-date').value = today;
    document.getElementById('booking-date').min = today;
    document.getElementById('booking-time').value = twoHoursLater;
}


/**
 * Renders the booking history from localStorage.
 */
function renderHistory() {
    const bookings = getBookings();
    historyListContainer.innerHTML = '';

    if (bookings.length === 0) {
        historyListContainer.innerHTML = '<p>No past bookings found.</p>';
        return;
    }

    bookings.reverse().forEach(booking => {
        const service = services.find(s => s.id === booking.serviceCategory);
        const card = document.createElement('div');
        card.className = 'card history-card';
        card.innerHTML = `
            <h4>${service ? service.name : 'Unknown Service'}</h4>
            <p><strong>Provider:</strong> ${booking.provider.name}</p>
            <p><strong>Date:</strong> ${new Date(booking.dateTime).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(booking.dateTime).toLocaleTimeString()}</p>
            <p><strong>Cost:</strong> $${booking.provider.price.toFixed(2)}</p>
            <div class="verification-badge">
                <span class="badge ${booking.provider.skill.toLowerCase()}">${booking.provider.skill}</span>
            </div>
        `;
        historyListContainer.appendChild(card);
    });
}


// --- LOCALSTORAGE & BOOKING LOGIC ---

/**
 * Retrieves bookings from localStorage.
 * @returns {Array} An array of booking objects.
 */
function getBookings() {
    return JSON.parse(localStorage.getItem('fixsureBookings')) || [];
}

/**
 * Saves a new booking to localStorage.
 * @param {object} booking The booking object to save.
 */
function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('fixsureBookings', JSON.stringify(bookings));
}

/**
 * Handles the booking confirmation logic.
 */
function handleConfirmBooking() {
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;

    if (!date || !time) {
        alert('Please select a date and time.');
        return;
    }

    const bookingDateTime = new Date(`${date}T${time}`);

    const newBooking = {
        provider: currentProvider,
        serviceCategory: currentCategory,
        dateTime: bookingDateTime.toISOString(),
    };

    saveBooking(newBooking);
    showPage('confirmation-page');
}


// --- INITIALIZATION ---

/**
 * Initializes the application.
 */
function init() {
    // Attach event listeners
    confirmBookingBtn.addEventListener('click', handleConfirmBooking);
    
    // Show the landing page by default
    showPage('landing-page');
}

// Run the app
document.addEventListener('DOMContentLoaded', init);
