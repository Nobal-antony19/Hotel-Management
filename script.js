// Function to show a custom alert message instead of browser's alert()
function showCustomAlert(message) {
    const alertModal = document.createElement('div');
    alertModal.id = 'custom-alert-modal';
    alertModal.style.cssText = `
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const alertContent = document.createElement('div');
    alertContent.style.cssText = `
        background-color: #333333;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        color: #eeeeee;
        box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        max-width: 90%;
        width: 400px;
        position: relative;
    `;

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 28px;
        font-weight: bold;
        color: #c25e5e;
        cursor: pointer;
    `;
    closeButton.onclick = () => alertModal.remove();

    const alertMessage = document.createElement('p');
    alertMessage.textContent = message;
    alertMessage.style.cssText = `
        margin-bottom: 20px;
        font-size: 1.1rem;
    `;

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.cssText = `
        background-color: #880808;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    `;
    okButton.onmouseover = (e) => e.target.style.backgroundColor = '#c25e5e';
    okButton.onmouseout = (e) => e.target.style.backgroundColor = '#880808';
    okButton.onclick = () => alertModal.remove();

    alertContent.appendChild(closeButton);
    alertContent.appendChild(alertMessage);
    alertContent.appendChild(okButton);
    alertModal.appendChild(alertContent);
    document.body.appendChild(alertModal);
}


const reservationForm = document.getElementById('reservation-form');
const reserveButtons = document.querySelectorAll('.reserve-btn');
const hotelNameInput = document.getElementById('hotel-name');
const reserveForm = document.getElementById('reserve-form');

if (reserveButtons) {
    reserveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const hotel = this.dataset.hotel;
            hotelNameInput.value = hotel;
            if (reservationForm) {
                reservationForm.style.display = 'block';
            }
        });
    });
}

if (reserveForm) {
    reserveForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = this.name.value;
        const email = this.email.value;
        const checkin = this.checkin.value;
        const checkout = this.checkout.value;
        const guests = this.guests.value;
        const hotel = hotelNameInput.value;

        const booking = {
            id: Date.now(),
            hotel: hotel,
            name: name,
            email: email,
            checkin: checkin,
            checkout: checkout,
            guests: guests
        };

        let bookings = localStorage.getItem('hotelBookings');
        bookings = bookings ? JSON.parse(bookings) : [];
        bookings.push(booking);
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));

        showCustomAlert(`Your reservation at ${hotel} has been confirmed!`); // Using custom alert
        if (reservationForm) {
            reservationForm.style.display = 'none';
        }
        reserveForm.reset();

        // Redirect to booked.html after a short delay for the alert to be seen
        setTimeout(() => {
            window.location.href = 'booked.html';
        }, 1500); // Wait 1.5 seconds before redirecting
    });
}


if (reservationForm) {
    window.onclick = function(event) {
        if (event.target == reservationForm) {
            reservationForm.style.display = "none";
        }
    }
}


const bookingsContainer = document.getElementById('bookings-container');
const noBookingsMessage = document.getElementById('no-bookings-message');
const manageModal = document.getElementById('manage-modal');
const manageForm = document.getElementById('manage-form');
const manageBookingIdInput = document.getElementById('manage-booking-id');
const manageCheckinInput = document.getElementById('manage-checkin');
const manageCheckoutInput = document.getElementById('manage-checkout');
const manageGuestsInput = document.getElementById('manage-guests');

let currentBookings = [];

function displayBookings() {
    const storedBookings = localStorage.getItem('hotelBookings');
    currentBookings = storedBookings ? JSON.parse(storedBookings) : [];

    if (bookingsContainer) {
        bookingsContainer.innerHTML = '';

        if (currentBookings.length === 0) {
            if (noBookingsMessage) {
                noBookingsMessage.style.display = 'block';
            }
        } else {
            if (noBookingsMessage) {
                noBookingsMessage.style.display = 'none';
            }
            currentBookings.forEach(booking => {
                const bookingCard = document.createElement('div');
                bookingCard.classList.add('booking-card');
                // Use a generic placeholder with the hotel name for booked images, for drag-and-drop flexibility
                const hotelImagePlaceholder = `https://placehold.co/150x150/333333/eeeeee?text=${booking.hotel.replace(/\s+/g, '%20')}`;
                bookingCard.innerHTML = `
                    <img src="${hotelImagePlaceholder}" alt="${booking.hotel}">
                    <div class="booking-details">
                        <h3>${booking.hotel}</h3>
                        <p>Check-in: ${booking.checkin}</p>
                        <p>Check-out: ${booking.checkout}</p>
                        <p>Guests: ${booking.guests}</p>
                        <button class="manage-btn" data-booking-id="${booking.id}">Manage Booking</button>
                    </div>
                `;
                bookingsContainer.appendChild(bookingCard);
            });

            // Add event listeners for manage buttons
            const manageButtons = document.querySelectorAll('.manage-btn');
            manageButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const bookingId = parseInt(this.dataset.bookingId);
                    const bookingToManage = currentBookings.find(booking => booking.id === bookingId);
                    if (bookingToManage) {
                        if (manageBookingIdInput) manageBookingIdInput.value = bookingId;
                        if (manageCheckinInput) manageCheckinInput.value = bookingToManage.checkin;
                        if (manageCheckoutInput) manageCheckoutInput.value = bookingToManage.checkout;
                        if (manageGuestsInput) manageGuestsInput.value = bookingToManage.guests;
                        if (manageModal) manageModal.style.display = 'block';
                    }
                });
            });
        }
    }
}

function updateBooking() {
    const bookingIdToUpdate = parseInt(manageBookingIdInput.value);
    const updatedCheckin = manageCheckinInput.value;
    const updatedCheckout = manageCheckoutInput.value;
    const updatedGuests = parseInt(manageGuestsInput.value);

    currentBookings = currentBookings.map(booking => {
        if (booking.id === bookingIdToUpdate) {
            return { ...booking, checkin: updatedCheckin, checkout: updatedCheckout, guests: updatedGuests };
        }
        return booking;
    });

    localStorage.setItem('hotelBookings', JSON.stringify(currentBookings));
    displayBookings();
    if (manageModal) {
        manageModal.style.display = 'none';
    }
    showCustomAlert('Booking updated successfully!'); // Using custom alert
}

function cancelBooking() {
    const bookingIdToDelete = parseInt(manageBookingIdInput.value);
    currentBookings = currentBookings.filter(booking => booking.id !== bookingIdToDelete);
    localStorage.setItem('hotelBookings', JSON.stringify(currentBookings));
    displayBookings();
    if (manageModal) {
        manageModal.style.display = 'none';
    }
    showCustomAlert('Booking cancelled successfully!'); // Using custom alert
}

if (manageForm) {
    manageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        updateBooking();
    });
}


if (manageModal) {
    window.onclick = function(event) {
        if (event.target == manageModal) {
            manageModal.style.display = "none";
        }
    }
}


// Check URL to decide which functions to run
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (navLinks) {
                navLinks.classList.toggle('active');
            }
        });
    }

    if (document.URL.includes('booked.html')) {
        displayBookings();
    }

    const landingSearchInput = document.getElementById('landing-search-input');
    const landingSearchButton = document.getElementById('landing-search-button');

    if (landingSearchButton && landingSearchInput) {
        landingSearchButton.addEventListener('click', () => {
            const query = landingSearchInput.value;
            // You can redirect to reserved.html with the search query as a parameter
            window.location.href = `reserved.html?search=${encodeURIComponent(query)}`;
        });
        // Allow pressing Enter to search on the landing page
        landingSearchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                landingSearchButton.click();
            }
        });
    }


    const hotelSearchInput = document.getElementById('hotel-search-input');
    const hotelSearchButton = document.getElementById('hotel-search-button'); // New button reference
    const hotelCards = document.querySelectorAll('.available-hotels .hotel-card');

    if (hotelSearchInput) {
        // Function to perform search
        const performSearch = () => {
            const searchText = hotelSearchInput.value.toLowerCase();
            hotelCards.forEach(card => {
                const hotelName = card.dataset.name.toLowerCase();
                if (hotelName.includes(searchText)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        // Event listener for input changes
        hotelSearchInput.addEventListener('input', performSearch);

        // Event listener for search button click (if it exists)
        if (hotelSearchButton) {
            hotelSearchButton.addEventListener('click', performSearch);
        }

        // Add keypress listener for Enter key on the hotel search input
        hotelSearchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        // Check for URL parameter for initial search on reserved.html
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            hotelSearchInput.value = searchQuery;
            performSearch(); // Perform search immediately if query exists
        }
    }
});

