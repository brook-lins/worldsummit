// Define the order we want - this is the exact sequence for navigation
const countryOrder = [
    "WHQ",      // Start with WHQ
    "Mexico",
    "Japan",
    "WHQ",
    "Brazil",
    "France",
    "Germany",
    "Netherlands",
    "Spain"
];

// Create the coordinates object
const countriesData = {
    "WHQ": { lat: 40.7128, lng: -74.0060 },
    "Mexico": { lat: 23.6345, lng: -102.5528 },
    "Japan": { lat: 36.2048, lng: 138.2529 },
    "Brazil": { lat: -14.2350, lng: -51.9253 },
    "France": { lat: 46.2276, lng: 2.2137 },
    "Germany": { lat: 51.1657, lng: 10.4515 },
    "Netherlands": { lat: 52.1326, lng: 5.2913 },
    "Spain": { lat: 40.4637, lng: -3.7492 }
};

// Make everything available globally
window.countriesData = countriesData;
window.countryOrder = countryOrder; 