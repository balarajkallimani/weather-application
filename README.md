# AeroWeather - Premium Weather Forecast Application

AeroWeather is a premium, modern, glassmorphic weather forecasting dashboard. It provides users with up-to-date meteorological conditions, 24-hour hourly forecasts, and 7-day outlooks. The interface is optimized to scale fluidly from desktop screens to tablet and mobile viewports.

---

## 🌟 Key Features

- **Premium Glassmorphic UI**: Crafted with modern, aesthetic color styling (cool tints of navy, cerulean, and soft ice blues) combined with frosted translucent panels, subtle hover transitions, and blur backdrops.
- **Dynamic Backgrounds**: Responsive canvas background glows that shift hues dynamically based on the current weather condition (Sunny, Cloudy, Rainy, Snowy, Stormy, or Windy).
- **Responsive Navigation Drawer**: On mobile and tablet, the application hides the search controls and recent history behind a sliding sidebar drawer to prioritize actual weather data on-screen, accompanied by a sticky header bar.
- **Custom Animated SVGs**: Dynamic, inline-injected SVGs that animate depending on weather states (e.g., rotating sun, floating clouds, falling rain drops, rotating snowflakes, and flashing lightning).
- **Recent Searches History**: LocalStorage-persisted query history for fast navigation, with individual history delete buttons.
- **Dual-Data Mode**: Supports live data fetch using the OpenWeather API or falls back to realistic, deterministic mock-data generation based on the target city name if no API key is specified.

---

## 🛠️ Technology Stack & Languages

AeroWeather is built using a lightweight stack comprising:

### 1. Languages
- **Python**: Backend server routing and weather API proxy logic.
- **HTML5**: Structured semantic interface markup.
- **CSS3 (Vanilla)**: Layout rendering (CSS Grid and Flexbox), keyframe-based micro-animations, glassmorphism filters, and media queries.
- **JavaScript (ES6+)**: Interactive client-side controller logic, UI state mapping, SVG weather icon injection, and LocalStorage persistence.

### 2. Frameworks & Backend Libraries
- **Flask (v3.0.3)**: Lightweight Python micro-framework handling index rendering and `/api/weather` endpoints.
- **Requests (v2.32.3)**: For executing robust HTTP calls to fetch raw data from external APIs.
- **python-dotenv (v1.0.1)**: Used to load local configurations and API keys from `.env` environment variables.

### 3. External APIs
- **OpenWeatherMap API**:
  - Current Weather API (`/data/2.5/weather`) for real-time temperature, pressure, humidity, wind, and basic conditions.
  - 5-Day/3-Hour Forecast API (`/data/2.5/forecast`) to build the 24-hour forecast list and 7-day outlook.

### 4. Icon & Typography Libraries
- **Google Fonts**:
  - `Outfit` (Primary layout and labels)
  - `Plus Jakarta Sans` (Secondary font, metadata, and search inputs)
- **FontAwesome (v6.4.0)**: Icons for weather statistics (wind, humidity, visibility, pressure) and layout controls (search, trash, menu).

---

## 📂 Project Directory Structure

```text
├── app.py                 # Flask server & mock-data engine
├── requirements.txt       # Python library dependencies
├── vercel.json            # Deployment configuration settings
├── .gitignore             # Ignored virtual envs & keys
├── templates/
│   └── index.html         # Main dashboard markup page
└── static/
    ├── css/
    │   └── style.css      # Custom stylesheet with glassmorphism & media queries
    └── js/
        └── main.js        # Controller managing fetches, rendering, and drawer states
```

---

## 🚀 Setup and Run Locally

### Prerequisites
- Python 3.8+ installed on your system.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/balarajkallimani/weather-application.git
   cd weather-application
   ```

2. **Set up a Virtual Environment**:
   ```powershell
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Add an API Key (Optional)**:
   Create a `.env` file in the root directory and add your OpenWeather API key:
   ```env
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```
   *Note: If no API key is set, the application will automatically generate realistic, deterministic mock weather data.*

5. **Start the Flask Application**:
   ```bash
   python app.py
   ```
   Open your browser and navigate to `http://127.0.0.1:5000`.