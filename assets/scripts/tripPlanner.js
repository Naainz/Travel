// assets/scripts/tripPlanner.js

import { fetchAverageTemperature, fetchTripDetails, adjustDateByOneYear } from './api.js';

const planTripButton = document.getElementById('planTripButton');
const plannerContainer = document.getElementById('plannerContainer');
const loadingContainer = document.getElementById('loadingContainer');
const loadingText = document.getElementById('loadingText');
const tripInfoCard = document.getElementById('tripInfoCard');
const tripTitle = document.getElementById('tripTitle');
const tripDates = document.getElementById('tripDates');
const tripTemperature = document.getElementById('tripTemperature');
const tripDetails = document.getElementById('tripDetails');

function parseMarkdown(text) {
    return text
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\n/gim, '<br />');
}

planTripButton.addEventListener('click', async () => {
    const destination = document.getElementById('destination').value;
    const departureDate = new Date(document.getElementById('departure-date').value);
    const returnDate = new Date(document.getElementById('return-date').value);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDepartureDate = departureDate.toLocaleDateString(undefined, options);
    const formattedReturnDate = returnDate.toLocaleDateString(undefined, options);

    plannerContainer.style.display = 'none';
    loadingText.innerText = `Planning your trip to ${destination}...`;
    loadingContainer.classList.add('show');

    console.log(`Destination: ${destination}`);
    console.log(`Departure Date: ${formattedDepartureDate}`);
    console.log(`Return Date: ${formattedReturnDate}`);

    try {
        const today = new Date().toISOString().split('T')[0];
        let startDate = departureDate.toISOString().split('T')[0];
        let endDate = returnDate.toISOString().split('T')[0];
        let averageTemperature;

        if (startDate > today) {
            startDate = adjustDateByOneYear(startDate);
            endDate = adjustDateByOneYear(endDate);
            averageTemperature = await fetchAverageTemperature(destination, startDate, endDate);
            tripTemperature.innerText = `Estimated ${averageTemperature}°C`;
        } else {
            averageTemperature = await fetchAverageTemperature(destination, startDate, endDate);
            tripTemperature.innerText = `Temp: ${averageTemperature}°F in active season`;
        }

        const tripDetailsContent = await fetchTripDetails(destination, formattedDepartureDate, formattedReturnDate);
        tripTitle.innerText = destination;
        tripDates.innerText = `From ${formattedDepartureDate} to ${formattedReturnDate}`;

        const parsedContent = parseMarkdown(tripDetailsContent);
        tripDetails.innerHTML = parsedContent;

        loadingContainer.classList.remove('show');
        tripInfoCard.style.display = 'block';

    } catch (error) {
        console.error('Error:', error.message);
        loadingText.innerText = 'There was an error planning your trip. Please try again.';
    }
});
