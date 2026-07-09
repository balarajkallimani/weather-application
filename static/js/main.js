/**
 * AeroWeather - Premium Weather Frontend Controller
 */

// App State
const state = {
    city: "New Delhi",
    unit: "C", // "C" or "F"
    weatherData: null,
    recentSearches: []
};

// DOM Elements
const elements = {
    citySearch: document.getElementById("city-search"),
    searchBtn: document.getElementById("search-btn"),
    recentList: document.getElementById("recent-list"),
    unitC: document.getElementById("unit-c"),
    unitF: document.getElementById("unit-f"),
    apiKeyInput: document.getElementById("api-key-input"),
    saveKeyBtn: document.getElementById("save-key-btn"),
    loader: document.getElementById("loader"),
    errorBanner: document.getElementById("error-banner"),
    errorMsg: document.getElementById("error-msg"),
    closeError: document.getElementById("close-error"),
    clearRecentsBtn: document.getElementById("clear-recents-btn"),
    
    // Mobile Drawer navigation elements
    sidebarDrawer: document.getElementById("sidebar-drawer"),
    menuToggleBtn: document.getElementById("menu-toggle-btn"),
    closeSidebarBtn: document.getElementById("close-sidebar-btn"),
    drawerBackdrop: document.getElementById("drawer-backdrop"),
    mobileSearchToggle: document.getElementById("mobile-search-toggle"),
    
    // Dashboard fields
    cityName: document.getElementById("city-name"),
    countryTag: document.getElementById("country-tag"),
    localTime: document.getElementById("local-time"),
    currentTemp: document.getElementById("current-temp"),
    weatherCondition: document.getElementById("weather-condition"),
    weatherDescription: document.getElementById("weather-description"),
    tempMax: document.getElementById("temp-max"),
    tempMin: document.getElementById("temp-min"),
    mainWeatherIcon: document.getElementById("main-weather-icon"),
    
    // Metrics
    feelsLike: document.getElementById("feels-like"),
    humidity: document.getElementById("humidity"),
    windSpeed: document.getElementById("wind-speed"),
    uvIndex: document.getElementById("uv-index"),
    pressure: document.getElementById("pressure"),
    visibility: document.getElementById("visibility"),
    
    // Forecast Containers
    hourlyContainer: document.getElementById("hourly-forecast-container"),
    dailyContainer: document.getElementById("daily-forecast-container")
};

// Animated SVGs Generator
const svgTemplates = {
    // Sunny/Clear Day
    "01d": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <circle cx="50" cy="50" r="18" fill="url(#sun-grad)" style="transform-origin: 50px 50px; animation: spin 15s linear infinite;" />
            <g style="transform-origin: 50px 50px; animation: spin 50s linear infinite;">
                <line x1="50" y1="18" x2="50" y2="10" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
                <line x1="50" y1="82" x2="50" y2="90" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
                <line x1="18" y1="50" x2="10" y2="50" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
                <line x1="82" y1="50" x2="90" y2="50" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
                <line x1="27" y1="27" x2="21" y2="21" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
                <line x1="73" y1="73" x2="79" y2="79" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
                <line x1="27" y1="73" x2="21" y2="79" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
                <line x1="73" y1="27" x2="79" y2="21" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
            </g>
            <defs>
                <linearGradient id="sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fbbf24" />
                    <stop offset="100%" stop-color="#ea580c" />
                </linearGradient>
            </defs>
        </svg>
    `,
    // Clear Night
    "01n": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M45,25 A22,22 0 1,0 75,55 A16,16 0 1,1 45,25 Z" fill="url(#moon-grad)" style="transform-origin: 45px 55px; animation: floatCloud 8s ease-in-out infinite;" />
            <circle cx="72" cy="22" r="1.5" fill="#fff" opacity="0.9" />
            <circle cx="28" cy="34" r="1.2" fill="#fff" opacity="0.6" />
            <circle cx="58" cy="82" r="1" fill="#fff" opacity="0.7" />
            <defs>
                <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f8fafc" />
                    <stop offset="100%" stop-color="#94a3b8" />
                </linearGradient>
            </defs>
        </svg>
    `,
    // Few Clouds / Partly Cloudy (Day)
    "02d": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <g style="transform-origin: 32px 32px; animation: spin 24s linear infinite;">
                <circle cx="32" cy="32" r="14" fill="#fbbf24" />
            </g>
            <path d="M25,65 a14,14 0 0,1 14,-14 a17,17 0 0,1 28,-4 a13,13 0 0,1 12,9 a11,11 0 0,1 -2,21 Z" fill="url(#cloud-glow)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <defs>
                <linearGradient id="cloud-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="100%" stop-color="#cbd5e1" />
                </linearGradient>
            </defs>
        </svg>
    `,
    // Few Clouds / Partly Cloudy (Night)
    "02n": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <g style="transform-origin: 32px 32px; animation: floatCloudBack 7s ease-in-out infinite;">
                <path d="M35,20 A15,15 0 1,0 55,40 A10,10 0 1,1 35,20 Z" fill="#e2e8f0" />
            </g>
            <path d="M25,65 a14,14 0 0,1 14,-14 a17,17 0 0,1 28,-4 a13,13 0 0,1 12,9 a11,11 0 0,1 -2,21 Z" fill="url(#cloud-glow-n)" style="animation: floatCloud 5s ease-in-out infinite;" />
            <defs>
                <linearGradient id="cloud-glow-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#94a3b8" />
                    <stop offset="100%" stop-color="#475569" />
                </linearGradient>
            </defs>
        </svg>
    `,
    // Scattered Clouds / Cloudy
    "03d": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M18,60 a11,11 0 0,1 11,-11 a14,14 0 0,1 24,-3 a11,11 0 0,1 10,7 a9,9 0 0,1 -1,17 Z" fill="url(#cloud-back)" style="animation: floatCloudBack 8s ease-in-out infinite;" />
            <path d="M30,68 a13,13 0 0,1 13,-13 a16,16 0 0,1 26,-4 a12,12 0 0,1 11,8 a10,10 0 0,1 -2,19 Z" fill="url(#cloud-front)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <defs>
                <linearGradient id="cloud-back" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#cbd5e1" />
                    <stop offset="100%" stop-color="#94a3b8" />
                </linearGradient>
                <linearGradient id="cloud-front" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="100%" stop-color="#cbd5e1" />
                </linearGradient>
            </defs>
        </svg>
    `,
    "03n": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M18,60 a11,11 0 0,1 11,-11 a14,14 0 0,1 24,-3 a11,11 0 0,1 10,7 a9,9 0 0,1 -1,17 Z" fill="url(#cloud-back-n)" style="animation: floatCloudBack 8s ease-in-out infinite;" />
            <path d="M30,68 a13,13 0 0,1 13,-13 a16,16 0 0,1 26,-4 a12,12 0 0,1 11,8 a10,10 0 0,1 -2,19 Z" fill="url(#cloud-front-n)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <defs>
                <linearGradient id="cloud-back-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#475569" />
                    <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
                <linearGradient id="cloud-front-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#64748b" />
                    <stop offset="100%" stop-color="#334155" />
                </linearGradient>
            </defs>
        </svg>
    `,
    // Overcast Cloudy
    "04d": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M18,60 a11,11 0 0,1 11,-11 a14,14 0 0,1 24,-3 a11,11 0 0,1 10,7 a9,9 0 0,1 -1,17 Z" fill="url(#cloud-back)" style="animation: floatCloudBack 8s ease-in-out infinite;" />
            <path d="M30,68 a13,13 0 0,1 13,-13 a16,16 0 0,1 26,-4 a12,12 0 0,1 11,8 a10,10 0 0,1 -2,19 Z" fill="url(#cloud-front)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <defs>
                <linearGradient id="cloud-back" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#cbd5e1" />
                    <stop offset="100%" stop-color="#94a3b8" />
                </linearGradient>
                <linearGradient id="cloud-front" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#e2e8f0" />
                    <stop offset="100%" stop-color="#94a3b8" />
                </linearGradient>
            </defs>
        </svg>
    `,
    "04n": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M18,60 a11,11 0 0,1 11,-11 a14,14 0 0,1 24,-3 a11,11 0 0,1 10,7 a9,9 0 0,1 -1,17 Z" fill="url(#cloud-back-n)" style="animation: floatCloudBack 8s ease-in-out infinite;" />
            <path d="M30,68 a13,13 0 0,1 13,-13 a16,16 0 0,1 26,-4 a12,12 0 0,1 11,8 a10,10 0 0,1 -2,19 Z" fill="url(#cloud-front-n)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <defs>
                <linearGradient id="cloud-back-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#334155" />
                    <stop offset="100%" stop-color="#0f172a" />
                </linearGradient>
                <linearGradient id="cloud-front-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#475569" />
                    <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
            </defs>
        </svg>
    `,
    // Rain
    "09d": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M30,55 a12,12 0 0,1 12,-12 a15,15 0 0,1 25,-4 a11,11 0 0,1 10,8 a10,10 0 0,1 -2,18 Z" fill="url(#rain-cloud-g)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <line x1="38" y1="65" x2="33" y2="78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.1s;" />
            <line x1="50" y1="68" x2="45" y2="81" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.5s;" />
            <line x1="62" y1="65" x2="57" y2="78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.3s;" />
            <defs>
                <linearGradient id="rain-cloud-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#94a3b8" />
                    <stop offset="100%" stop-color="#475569" />
                </linearGradient>
            </defs>
        </svg>
    `,
    "09n": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M30,55 a12,12 0 0,1 12,-12 a15,15 0 0,1 25,-4 a11,11 0 0,1 10,8 a10,10 0 0,1 -2,18 Z" fill="url(#rain-cloud-g-n)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <line x1="38" y1="65" x2="33" y2="78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.1s;" />
            <line x1="50" y1="68" x2="45" y2="81" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.5s;" />
            <line x1="62" y1="65" x2="57" y2="78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.3s;" />
            <defs>
                <linearGradient id="rain-cloud-g-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#475569" />
                    <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
            </defs>
        </svg>
    `,
    "10d": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M30,55 a12,12 0 0,1 12,-12 a15,15 0 0,1 25,-4 a11,11 0 0,1 10,8 a10,10 0 0,1 -2,18 Z" fill="url(#rain-cloud-g)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <line x1="38" y1="65" x2="33" y2="78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.1s;" />
            <line x1="50" y1="68" x2="45" y2="81" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.5s;" />
            <line x1="62" y1="65" x2="57" y2="78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.3s;" />
            <defs>
                <linearGradient id="rain-cloud-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#94a3b8" />
                    <stop offset="100%" stop-color="#475569" />
                </linearGradient>
            </defs>
        </svg>
    `,
    "10n": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M30,55 a12,12 0 0,1 12,-12 a15,15 0 0,1 25,-4 a11,11 0 0,1 10,8 a10,10 0 0,1 -2,18 Z" fill="url(#rain-cloud-g-n)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <line x1="38" y1="65" x2="33" y2="78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.1s;" />
            <line x1="50" y1="68" x2="45" y2="81" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.5s;" />
            <line x1="62" y1="65" x2="57" y2="78" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" style="animation: rainDrop 1.2s linear infinite; animation-delay: 0.3s;" />
            <defs>
                <linearGradient id="rain-cloud-g-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#475569" />
                    <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
            </defs>
        </svg>
    `,
    // Thunderstorm
    "11d": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M30,55 a12,12 0 0,1 12,-12 a15,15 0 0,1 25,-4 a11,11 0 0,1 10,8 a10,10 0 0,1 -2,18 Z" fill="url(#storm-cloud-g)" style="animation: floatCloud 5s ease-in-out infinite;" />
            <polygon points="48,58 40,72 47,72 42,88 56,70 49,70" fill="#fbbf24" style="animation: lightningFlash 4s infinite;" />
            <line x1="35" y1="65" x2="30" y2="78" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" style="animation: rainDrop 0.8s linear infinite; animation-delay: 0.2s;" />
            <line x1="60" y1="65" x2="55" y2="78" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" style="animation: rainDrop 0.8s linear infinite; animation-delay: 0.6s;" />
            <defs>
                <linearGradient id="storm-cloud-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#64748b" />
                    <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
            </defs>
        </svg>
    `,
    "11n": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M30,55 a12,12 0 0,1 12,-12 a15,15 0 0,1 25,-4 a11,11 0 0,1 10,8 a10,10 0 0,1 -2,18 Z" fill="url(#storm-cloud-g-n)" style="animation: floatCloud 5s ease-in-out infinite;" />
            <polygon points="48,58 40,72 47,72 42,88 56,70 49,70" fill="#fbbf24" style="animation: lightningFlash 3.5s infinite;" />
            <line x1="35" y1="65" x2="30" y2="78" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" style="animation: rainDrop 0.8s linear infinite; animation-delay: 0.2s;" />
            <line x1="60" y1="65" x2="55" y2="78" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" style="animation: rainDrop 0.8s linear infinite; animation-delay: 0.6s;" />
            <defs>
                <linearGradient id="storm-cloud-g-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#334155" />
                    <stop offset="100%" stop-color="#020617" />
                </linearGradient>
            </defs>
        </svg>
    `,
    // Snow
    "13d": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M30,55 a12,12 0 0,1 12,-12 a15,15 0 0,1 25,-4 a11,11 0 0,1 10,8 a10,10 0 0,1 -2,18 Z" fill="url(#snow-cloud-g)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <circle cx="36" cy="68" r="2" fill="#e0f2fe" style="animation: snowFlake 2.5s linear infinite; animation-delay: 0.3s;" />
            <circle cx="50" cy="72" r="2.2" fill="#e0f2fe" style="animation: snowFlake 2.5s linear infinite; animation-delay: 1.1s;" />
            <circle cx="64" cy="68" r="1.8" fill="#e0f2fe" style="animation: snowFlake 2.5s linear infinite; animation-delay: 1.8s;" />
            <defs>
                <linearGradient id="snow-cloud-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#e2e8f0" />
                    <stop offset="100%" stop-color="#cbd5e1" />
                </linearGradient>
            </defs>
        </svg>
    `,
    "13n": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M30,55 a12,12 0 0,1 12,-12 a15,15 0 0,1 25,-4 a11,11 0 0,1 10,8 a10,10 0 0,1 -2,18 Z" fill="url(#snow-cloud-g-n)" style="animation: floatCloud 6s ease-in-out infinite;" />
            <circle cx="36" cy="68" r="2" fill="#f0f9ff" style="animation: snowFlake 2.5s linear infinite; animation-delay: 0.3s;" />
            <circle cx="50" cy="72" r="2.2" fill="#f0f9ff" style="animation: snowFlake 2.5s linear infinite; animation-delay: 1.1s;" />
            <circle cx="64" cy="68" r="1.8" fill="#f0f9ff" style="animation: snowFlake 2.5s linear infinite; animation-delay: 1.8s;" />
            <defs>
                <linearGradient id="snow-cloud-g-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#475569" />
                    <stop offset="100%" stop-color="#334155" />
                </linearGradient>
            </defs>
        </svg>
    `,
    // Mist / Wind / Fog
    "50d": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M20,35 L70,35" stroke="url(#wind-g)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="12 6" style="animation: floatCloudBack 6s ease-in-out infinite;" />
            <path d="M15,50 L85,50" stroke="url(#wind-g)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="18 8" style="animation: floatCloud 5s ease-in-out infinite;" />
            <path d="M28,65 L78,65" stroke="url(#wind-g)" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="10 5" style="animation: floatCloudBack 7s ease-in-out infinite;" />
            <defs>
                <linearGradient id="wind-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#cbd5e1" />
                    <stop offset="100%" stop-color="#94a3b8" />
                </linearGradient>
            </defs>
        </svg>
    `,
    "50n": `
        <svg viewBox="0 0 100 100" class="svg-weather">
            <path d="M20,35 L70,35" stroke="url(#wind-g-n)" stroke-width="4" stroke-linecap="round" stroke-dasharray="12 6" style="animation: floatCloudBack 6s ease-in-out infinite;" />
            <path d="M15,50 L85,50" stroke="url(#wind-g-n)" stroke-width="4" stroke-linecap="round" stroke-dasharray="18 8" style="animation: floatCloud 5s ease-in-out infinite;" />
            <path d="M28,65 L78,65" stroke="url(#wind-g-n)" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 5" style="animation: floatCloudBack 7s ease-in-out infinite;" />
            <defs>
                <linearGradient id="wind-g-n" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#475569" />
                    <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
            </defs>
        </svg>
    `
};

// Map condition key to generic openweather icons
const conditionToIconMap = {
    "Sunny": "01d",
    "Cloudy": "03d",
    "Rainy": "09d",
    "Snowy": "13d",
    "Stormy": "11d",
    "Windy": "50d"
};

// Helper: Get Animated SVG by Icon Name
function getWeatherSVG(iconCode) {
    // Check if directly mapped
    if (svgTemplates[iconCode]) {
        return svgTemplates[iconCode];
    }
    
    // Normalize (e.g. if icon has a 'd' or 'n' suffix or we need a default)
    const normalizedCode = iconCode ? iconCode.replace(/[^\d\w]/g, "") : "03d";
    if (svgTemplates[normalizedCode]) {
        return svgTemplates[normalizedCode];
    }
    
    // Fallback: search for first two digits (e.g. 01d vs 01n fallback)
    const prefix = normalizedCode.substring(0, 2);
    const dayVersion = prefix + "d";
    if (svgTemplates[dayVersion]) {
        return svgTemplates[dayVersion];
    }
    
    // Ultimate fallback is scattered clouds
    return svgTemplates["03d"];
}

// Convert Celsius to Fahrenheit
function cToF(celsius) {
    return Math.round((celsius * 9) / 5 + 32);
}

// Format Temp Value depending on state
function formatTemp(tempVal) {
    const numericTemp = parseFloat(tempVal);
    if (state.unit === "F") {
        return `${cToF(numericTemp)}°`;
    }
    return `${Math.round(numericTemp)}°`;
}

// Initialize Application
function init() {
    loadSettings();
    setupEventListeners();
    fetchWeather(state.city);
}

// Load configurations from localStorage
function loadSettings() {
    // 1. Unit setting
    const savedUnit = localStorage.getItem("aero_unit");
    if (savedUnit && (savedUnit === "C" || savedUnit === "F")) {
        state.unit = savedUnit;
        updateUnitUI();
    }
    
    // 2. Saved API key
    const savedKey = localStorage.getItem("aero_api_key");
    if (savedKey) {
        elements.apiKeyInput.value = savedKey;
    }
    
    // 3. Recent searches
    const savedRecents = localStorage.getItem("aero_recents");
    if (savedRecents) {
        state.recentSearches = JSON.parse(savedRecents);
        renderRecentsList();
    } else {
        // Defaults
        state.recentSearches = ["New Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai"];
        saveRecents();
        renderRecentsList();
    }
}

// Setup Event Handlers
function setupEventListeners() {
    // Search Actions
    elements.searchBtn.addEventListener("click", () => triggerSearch());
    elements.citySearch.addEventListener("keypress", (e) => {
        if (e.key === "Enter") triggerSearch();
    });
    
    // Mobile drawer toggles
    if (elements.menuToggleBtn) {
        elements.menuToggleBtn.addEventListener("click", openDrawer);
    }
    if (elements.closeSidebarBtn) {
        elements.closeSidebarBtn.addEventListener("click", closeDrawer);
    }
    if (elements.drawerBackdrop) {
        elements.drawerBackdrop.addEventListener("click", closeDrawer);
    }
    if (elements.mobileSearchToggle) {
        elements.mobileSearchToggle.addEventListener("click", () => {
            openDrawer();
            setTimeout(() => {
                if (elements.citySearch) elements.citySearch.focus();
            }, 300);
        });
    }
    
    // Unit Switches
    elements.unitC.addEventListener("click", () => {
        if (state.unit !== "C") {
            state.unit = "C";
            localStorage.setItem("aero_unit", "C");
            updateUnitUI();
            updateDashboardData();
        }
    });
    elements.unitF.addEventListener("click", () => {
        if (state.unit !== "F") {
            state.unit = "F";
            localStorage.setItem("aero_unit", "F");
            updateUnitUI();
            updateDashboardData();
        }
    });
    
    // Save API Key
    elements.saveKeyBtn.addEventListener("click", () => {
        const apiKey = elements.apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem("aero_api_key", apiKey);
            showBanner("API Key saved. Refetching weather...", false);
        } else {
            localStorage.removeItem("aero_api_key");
            showBanner("API Key cleared. Reverting to mock data.", false);
        }
        fetchWeather(state.city);
    });
    
    // Error Banner Close
    elements.closeError.addEventListener("click", () => {
        elements.errorBanner.classList.remove("active");
    });
    
    // Clear Recent searches
    elements.clearRecentsBtn.addEventListener("click", () => {
        state.recentSearches = ["New Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai"];
        saveRecents();
        renderRecentsList();
        showBanner("History reset to defaults.", false);
    });
}

// Drawer Helper Actions
function openDrawer() {
    if (elements.sidebarDrawer) elements.sidebarDrawer.classList.add("open");
    if (elements.drawerBackdrop) elements.drawerBackdrop.classList.add("active");
}

function closeDrawer() {
    if (elements.sidebarDrawer) elements.sidebarDrawer.classList.remove("open");
    if (elements.drawerBackdrop) elements.drawerBackdrop.classList.remove("active");
}

// Trigger Search
function triggerSearch() {
    const searchVal = elements.citySearch.value.trim();
    if (searchVal) {
        fetchWeather(searchVal);
        elements.citySearch.value = "";
        closeDrawer();
    }
}

// Toggle Unit Toggle Buttons in UI
function updateUnitUI() {
    if (state.unit === "C") {
        elements.unitC.classList.add("active");
        elements.unitF.classList.remove("active");
    } else {
        elements.unitF.classList.add("active");
        elements.unitC.classList.remove("active");
    }
}

// Show Error/Notification Banner
function showBanner(message, isError = true) {
    elements.errorMsg.textContent = message;
    if (isError) {
        elements.errorBanner.style.background = "rgba(239, 68, 68, 0.15)";
        elements.errorBanner.style.borderColor = "rgba(239, 68, 68, 0.3)";
        elements.errorBanner.style.color = "#fca5a5";
    } else {
        // Info Banner styling
        elements.errorBanner.style.background = "rgba(16, 185, 129, 0.15)";
        elements.errorBanner.style.borderColor = "rgba(16, 185, 129, 0.3)";
        elements.errorBanner.style.color = "#a7f3d0";
    }
    elements.errorBanner.classList.add("active");
    
    // Auto-dim banner after 5 seconds
    setTimeout(() => {
        elements.errorBanner.classList.remove("active");
    }, 5000);
}

// Add City to Recent list
function addCityToRecent(city) {
    const formattedCity = city.trim();
    
    // Remove if already in list to put it on top
    state.recentSearches = state.recentSearches.filter(
        c => c.toLowerCase() !== formattedCity.toLowerCase()
    );
    
    // Add to top
    state.recentSearches.unshift(formattedCity);
    
    // Limit to 5
    if (state.recentSearches.length > 5) {
        state.recentSearches.pop();
    }
    
    saveRecents();
    renderRecentsList();
}

function saveRecents() {
    localStorage.setItem("aero_recents", JSON.stringify(state.recentSearches));
}

// Render Recents list
function renderRecentsList() {
    elements.recentList.innerHTML = "";
    state.recentSearches.forEach(city => {
        const li = document.createElement("li");
        
        const citySpan = document.createElement("span");
        citySpan.textContent = city;
        li.appendChild(citySpan);
        
        const delIcon = document.createElement("i");
        delIcon.className = "fa-solid fa-xmark delete-recent";
        delIcon.title = "Delete search";
        delIcon.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent triggering search
            deleteRecentCity(city);
        });
        li.appendChild(delIcon);
        
        li.addEventListener("click", () => {
            fetchWeather(city);
            closeDrawer();
        });
        
        elements.recentList.appendChild(li);
    });
}

// Delete from recent searches
function deleteRecentCity(city) {
    state.recentSearches = state.recentSearches.filter(c => c !== city);
    saveRecents();
    renderRecentsList();
}

// Set Theme Background based on Weather Condition
function updateBodyTheme(condition) {
    document.body.className = ""; // clear all themes
    
    const condNorm = condition ? condition.trim().toLowerCase() : "cloudy";
    
    if (condNorm.includes("sunny") || condNorm.includes("clear")) {
        document.body.classList.add("theme-sunny");
    } else if (condNorm.includes("rain") || condNorm.includes("drizzle") || condNorm.includes("mist")) {
        document.body.classList.add("theme-rainy");
    } else if (condNorm.includes("snow") || condNorm.includes("ice")) {
        document.body.classList.add("theme-snowy");
    } else if (condNorm.includes("storm") || condNorm.includes("thunder")) {
        document.body.classList.add("theme-stormy");
    } else {
        document.body.classList.add("theme-cloudy");
    }
}

// API Call to Python Backend
async function fetchWeather(city) {
    elements.loader.classList.add("active");
    
    try {
        let url = `/api/weather?city=${encodeURIComponent(city)}`;
        
        // Pass local API Key if present
        const localKey = localStorage.getItem("aero_api_key");
        
        const headers = {};
        // Alternatively we can append it as query param or custom header
        if (localKey) {
            // In case the backend has been configured to read headers
            headers["X-API-Key"] = localKey;
            // Let's also attach it to query param just in case
            url += `&key=${encodeURIComponent(localKey)}`;
        }
        
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        state.city = data.city;
        state.weatherData = data;
        
        // Add to recents
        addCityToRecent(data.city);
        
        // Update DOM
        updateDashboardData();
        updateBodyTheme(data.condition);
        
    } catch (err) {
        console.error("Fetch weather failed: ", err);
        showBanner(err.message || "Failed to load weather data.");
    } finally {
        elements.loader.classList.remove("active");
    }
}

// Update DOM elements with active state weather data
function updateDashboardData() {
    const data = state.weatherData;
    if (!data) return;
    
    // Location and time info
    elements.cityName.textContent = data.city;
    elements.countryTag.textContent = data.country;
    elements.localTime.textContent = `${data.local_date} | Local Time: ${data.local_time}`;
    
    // Core temperatures
    elements.currentTemp.textContent = Math.round(state.unit === "F" ? cToF(data.temperature) : data.temperature);
    document.querySelectorAll(".temp-unit").forEach(el => el.textContent = `°${state.unit}`);
    
    elements.tempMax.textContent = formatTemp(data.temp_max);
    elements.tempMin.textContent = formatTemp(data.temp_min);
    
    // Weather condition and animated SVG
    elements.weatherCondition.textContent = data.condition;
    elements.weatherDescription.textContent = data.description;
    elements.mainWeatherIcon.innerHTML = getWeatherSVG(data.icon);
    
    // Detailed stats
    elements.feelsLike.textContent = formatTemp(data.feels_like);
    elements.humidity.textContent = `${data.humidity}%`;
    
    // Wind Speed format (Imperial converts to mph)
    if (state.unit === "F") {
        const windMph = roundTo(data.wind_speed * 2.23694, 1);
        elements.windSpeed.textContent = `${windMph} mph`;
    } else {
        elements.windSpeed.textContent = `${data.wind_speed} m/s`;
    }
    
    elements.uvIndex.textContent = data.uv_index;
    elements.pressure.textContent = `${data.pressure} hPa`;
    
    // Visibility format (Imperial converts to miles)
    if (state.unit === "F") {
        const visMiles = roundTo(data.visibility * 0.621371, 1);
        elements.visibility.textContent = `${visMiles} miles`;
    } else {
        elements.visibility.textContent = `${data.visibility} km`;
    }
    
    // 24h Hourly Forecast list
    renderHourlyForecast(data.hourly);
    
    // 7-day Daily Outlook list
    renderDailyForecast(data.daily);
}

// Render Hourly scroll list
function renderHourlyForecast(hourlyData) {
    elements.hourlyContainer.innerHTML = "";
    if (!hourlyData || hourlyData.length === 0) return;
    
    hourlyData.forEach(item => {
        const card = document.createElement("div");
        card.className = "hourly-card";
        
        const timeEl = document.createElement("span");
        timeEl.className = "hour-time";
        timeEl.textContent = item.time;
        
        const iconEl = document.createElement("div");
        iconEl.className = "hour-icon";
        iconEl.innerHTML = getWeatherSVG(item.icon);
        
        const tempEl = document.createElement("span");
        tempEl.className = "hour-temp";
        tempEl.textContent = formatTemp(item.temp);
        
        card.appendChild(timeEl);
        card.appendChild(iconEl);
        card.appendChild(tempEl);
        
        elements.hourlyContainer.appendChild(card);
    });
}

// Render Daily forecast list
function renderDailyForecast(dailyData) {
    elements.dailyContainer.innerHTML = "";
    if (!dailyData || dailyData.length === 0) return;
    
    dailyData.forEach(item => {
        const row = document.createElement("div");
        row.className = "daily-row";
        
        // Day name + Date info
        const dayInfo = document.createElement("div");
        dayInfo.className = "daily-day-info";
        
        const nameEl = document.createElement("div");
        nameEl.className = "daily-day-name";
        nameEl.textContent = item.day;
        
        const dateEl = document.createElement("div");
        dateEl.className = "daily-date-tag";
        dateEl.textContent = item.date;
        
        dayInfo.appendChild(nameEl);
        dayInfo.appendChild(dateEl);
        
        // Condition text + icon
        const conditionEl = document.createElement("div");
        conditionEl.className = "daily-condition";
        
        const iconBox = document.createElement("div");
        iconBox.className = "daily-icon-box";
        iconBox.innerHTML = getWeatherSVG(item.icon);
        
        const condText = document.createElement("span");
        condText.textContent = item.condition;
        
        conditionEl.appendChild(iconBox);
        conditionEl.appendChild(condText);
        
        // Temperatures
        const tempsEl = document.createElement("div");
        tempsEl.className = "daily-temps";
        
        const minEl = document.createElement("span");
        minEl.className = "daily-temp-min";
        minEl.textContent = formatTemp(item.temp_min);
        
        const maxEl = document.createElement("span");
        maxEl.className = "daily-temp-max";
        maxEl.textContent = formatTemp(item.temp_max);
        
        tempsEl.appendChild(minEl);
        tempsEl.appendChild(maxEl);
        
        // Assemble Row
        row.appendChild(dayInfo);
        row.appendChild(conditionEl);
        row.appendChild(tempsEl);
        
        elements.dailyContainer.appendChild(row);
    });
}

// Helper: Round float to decimal points
function roundTo(num, decimals) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Run init on load
window.addEventListener("DOMContentLoaded", init);
