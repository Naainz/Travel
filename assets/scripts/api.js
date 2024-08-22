// assets/scripts/api.js

const API_KEY = 'YOUR-OPENAI-API-KEY';

async function fetchAverageTemperature(destination, startDate, endDate) {
    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${destination}`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Location not found.");
        }

        const { latitude, longitude } = geoData.results[0];

        const weatherResponse = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weatherData = await weatherResponse.json();

        if (weatherData.error) {
            throw new Error(weatherData.reason);
        }

        if (!weatherData.daily || !weatherData.daily.temperature_2m_max || !weatherData.daily.temperature_2m_min) {
            throw new Error("Temperature data not available for the given dates.");
        }

        const dailyTemperatures = weatherData.daily.temperature_2m_max.map((maxTemp, index) => {
            const minTemp = weatherData.daily.temperature_2m_min[index];
            return (maxTemp + minTemp) / 2;
        });

        const averageTemperature = dailyTemperatures.reduce((sum, temp) => sum + temp, 0) / dailyTemperatures.length;

        return Math.round(averageTemperature);
    } catch (error) {
        console.error("Error:", error.message);
        throw new Error("Could not fetch temperature data.");
    }
}

async function fetchTripDetails(destination, formattedDepartureDate, formattedReturnDate) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'user',
                    content: `Plan a trip to ${destination} from ${formattedDepartureDate} to ${formattedReturnDate}`
                }]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Could not fetch trip details.');
    }
}

function adjustDateByOneYear(dateString, offset = -1) {
    const date = new Date(dateString);
    date.setFullYear(date.getFullYear() + offset);
    return date.toISOString().split('T')[0];
}

export { fetchAverageTemperature, fetchTripDetails, adjustDateByOneYear };
