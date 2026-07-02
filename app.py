import os
import random
import time
from datetime import datetime, timedelta
from flask import Flask, jsonify, render_template, request
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# List of known cities with base climates for realistic mock data
CITY_CLIMATES = {
    "london": {"temp_base": 14, "humidity_base": 75, "wind_base": 5, "condition_prob": ["Cloudy", "Rainy", "Cloudy", "Sunny"]},
    "new york": {"temp_base": 18, "humidity_base": 60, "wind_base": 4, "condition_prob": ["Sunny", "Sunny", "Cloudy", "Rainy"]},
    "tokyo": {"temp_base": 17, "humidity_base": 70, "wind_base": 3, "condition_prob": ["Sunny", "Cloudy", "Sunny", "Rainy"]},
    "sydney": {"temp_base": 20, "humidity_base": 65, "wind_base": 6, "condition_prob": ["Sunny", "Sunny", "Cloudy", "Windy"]},
    "paris": {"temp_base": 16, "humidity_base": 65, "wind_base": 4, "condition_prob": ["Sunny", "Cloudy", "Cloudy", "Rainy"]},
    "new delhi": {"temp_base": 29, "humidity_base": 60, "wind_base": 3, "condition_prob": ["Sunny", "Sunny", "Cloudy", "Rainy", "Stormy"]},
    "mumbai": {"temp_base": 29, "humidity_base": 82, "wind_base": 4, "condition_prob": ["Rainy", "Rainy", "Cloudy", "Sunny"]},
    "bengaluru": {"temp_base": 23, "humidity_base": 65, "wind_base": 4, "condition_prob": ["Sunny", "Cloudy", "Windy", "Sunny"]},
    "kolkata": {"temp_base": 28, "humidity_base": 75, "wind_base": 3, "condition_prob": ["Cloudy", "Rainy", "Stormy", "Sunny"]},
    "chennai": {"temp_base": 31, "humidity_base": 78, "wind_base": 4, "condition_prob": ["Sunny", "Sunny", "Cloudy", "Rainy"]},
    "cairo": {"temp_base": 28, "humidity_base": 40, "wind_base": 4, "condition_prob": ["Sunny", "Sunny", "Sunny", "Sunny"]},
    "moscow": {"temp_base": 5, "humidity_base": 80, "wind_base": 4, "condition_prob": ["Snowy", "Cloudy", "Rainy", "Cloudy"]},
    "reykjavik": {"temp_base": 4, "humidity_base": 85, "wind_base": 8, "condition_prob": ["Snowy", "Rainy", "Cloudy", "Snowy"]},
    "rio de janeiro": {"temp_base": 25, "humidity_base": 75, "wind_base": 3, "condition_prob": ["Sunny", "Sunny", "Cloudy", "Rainy"]},
    "toronto": {"temp_base": 10, "humidity_base": 60, "wind_base": 5, "condition_prob": ["Cloudy", "Sunny", "Snowy", "Rainy"]}
}

CONDITION_DETAILS = {
    "Sunny": {"desc": "clear sky", "icon": "01d", "icon_n": "01n", "uv": 7, "visibility": 10},
    "Cloudy": {"desc": "broken clouds", "icon": "04d", "icon_n": "04n", "uv": 3, "visibility": 9},
    "Rainy": {"desc": "moderate rain", "icon": "10d", "icon_n": "10n", "uv": 1, "visibility": 6},
    "Snowy": {"desc": "light snow", "icon": "13d", "icon_n": "13n", "uv": 1, "visibility": 4},
    "Stormy": {"desc": "thunderstorm with rain", "icon": "11d", "icon_n": "11n", "uv": 0, "visibility": 3},
    "Windy": {"desc": "gusty winds", "icon": "50d", "icon_n": "50n", "uv": 4, "visibility": 8}
}

def generate_mock_weather(city_name):
    """
    Generates realistic, deterministic mock weather data based on the city name.
    Seeding with the city name ensures consistency for the same city.
    """
    city_clean = city_name.strip().lower()
    
    # Simple deterministic seed based on city name characters
    seed_val = sum(ord(c) for c in city_clean)
    random.seed(seed_val)
    
    # Determine base climate
    climate = CITY_CLIMATES.get(city_clean)
    if not climate:
        # Fallback for unknown cities: generate a random base climate based on name seed
        temp_base = (seed_val % 30) + 2  # 2C to 32C
        humidity_base = (seed_val % 50) + 40  # 40% to 90%
        wind_base = (seed_val % 10) + 2  # 2 to 12 m/s
        cond_pool = ["Sunny", "Cloudy", "Rainy", "Stormy", "Snowy", "Windy"]
        condition_prob = [cond_pool[seed_val % len(cond_pool)], cond_pool[(seed_val + 2) % len(cond_pool)], "Cloudy"]
        climate = {
            "temp_base": temp_base,
            "humidity_base": humidity_base,
            "wind_base": wind_base,
            "condition_prob": condition_prob
        }
        
    # Main weather calculations
    condition = random.choice(climate["condition_prob"])
    details = CONDITION_DETAILS[condition]
    
    # Fluctuate base temp slightly for current temperature
    temp = round(climate["temp_base"] + random.uniform(-4, 4), 1)
    # Ensure freezing temps for snowy conditions
    if condition == "Snowy" and temp > 1:
        temp = round(random.uniform(-5, 0), 1)
    
    temp_min = round(temp - random.uniform(3, 7), 1)
    temp_max = round(temp + random.uniform(3, 7), 1)
    
    humidity = min(100, max(10, int(climate["humidity_base"] + random.uniform(-10, 10))))
    wind_speed = round(climate["wind_base"] + random.uniform(-2, 5), 1)
    pressure = int(1013 + random.uniform(-15, 15))
    
    feels_like = round(temp + (0.1 * (humidity - 50)) - (0.08 * wind_speed), 1)
    
    # Icon selection based on day/night
    current_hour = datetime.now().hour
    is_night = current_hour < 6 or current_hour > 18
    icon = details["icon_n"] if is_night else details["icon"]
    
    # Formulate current time for city (mock UTC offsets for demo)
    utc_offset = (seed_val % 25) - 12  # -12 to +12
    city_time = datetime.utcnow() + timedelta(hours=utc_offset)
    
    # Generate 24h Hourly Forecast
    hourly = []
    start_time = datetime.now().replace(minute=0, second=0, microsecond=0)
    for i in range(24):
        hour_dt = start_time + timedelta(hours=i)
        h_hour = hour_dt.hour
        h_is_night = h_hour < 6 or h_hour > 18
        
        # Diurnal temperature cycle: warmest at 15:00, coolest at 05:00
        diurnal_factor = -math_cos_approx((h_hour - 5) / 24.0 * 2.0 * 3.14159) # Cosine peak at 17, min at 5
        h_temp = round(temp + (diurnal_factor * 4) + random.uniform(-1, 1), 1)
        
        # Hourly condition fluctuation
        h_cond = condition
        if random.random() > 0.7:
            h_cond = random.choice(climate["condition_prob"])
        
        h_details = CONDITION_DETAILS[h_cond]
        h_icon = h_details["icon_n"] if h_is_night else h_details["icon"]
        
        hourly.append({
            "time": hour_dt.strftime("%H:00"),
            "temp": h_temp,
            "icon": h_icon,
            "condition": h_cond,
            "description": h_details["desc"]
        })
        
    # Generate 7-day Daily Forecast
    daily = []
    days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    current_day_idx = datetime.now().weekday()  # Monday is 0, Sunday is 6
    
    # Normalize index: Python weekday() maps 0=Monday to 6=Sunday. Let's align with days_of_week
    # Monday is index 1 in days_of_week if Sunday is index 0.
    # Python 0=Monday => days_of_week index 1
    for i in range(7):
        day_dt = datetime.now() + timedelta(days=i)
        day_name = days_of_week[day_dt.weekday() % 7]
        
        # Fluctuate day temperatures
        d_temp_base = climate["temp_base"] + random.uniform(-5, 5)
        d_temp_min = round(d_temp_base - random.uniform(3, 6), 1)
        d_temp_max = round(d_temp_base + random.uniform(3, 6), 1)
        
        d_cond = random.choice(climate["condition_prob"])
        # Ensure freezing temps for snowy days
        if d_cond == "Snowy" and d_temp_max > 1:
            d_temp_max = round(random.uniform(-2, 1), 1)
            d_temp_min = round(d_temp_max - random.uniform(3, 6), 1)
            
        d_details = CONDITION_DETAILS[d_cond]
        
        daily.append({
            "day": "Today" if i == 0 else day_name,
            "date": day_dt.strftime("%b %d"),
            "temp_min": d_temp_min,
            "temp_max": d_temp_max,
            "icon": d_details["icon"],
            "condition": d_cond,
            "description": d_details["desc"]
        })

    # Reset random seed
    random.seed(None)
    
    return {
        "city": city_name.title(),
        "country": {
            "london": "UK",
            "new york": "US",
            "tokyo": "JP",
            "sydney": "AU",
            "paris": "FR",
            "new delhi": "IN",
            "mumbai": "IN",
            "bengaluru": "IN",
            "kolkata": "IN",
            "chennai": "IN",
            "cairo": "EG",
            "moscow": "RU",
            "reykjavik": "IS",
            "rio de janeiro": "BR",
            "toronto": "CA"
        }.get(city_clean, "IN" if city_clean in ["india", "delhi", "pune", "hyderabad", "ahmedabad", "jaipur", "lucknow", "bengaluru", "chennai", "mumbai", "new delhi", "kolkata"] else "Mock Country"),
        "temperature": temp,
        "feels_like": feels_like,
        "temp_min": temp_min,
        "temp_max": temp_max,
        "condition": condition,
        "description": details["desc"],
        "humidity": humidity,
        "wind_speed": wind_speed,
        "uv_index": details["uv"],
        "pressure": pressure,
        "visibility": details["visibility"],
        "icon": icon,
        "local_time": city_time.strftime("%I:%M %p"),
        "local_date": city_time.strftime("%A, %B %d"),
        "hourly": hourly,
        "daily": daily,
        "provider": "mock"
    }

def math_cos_approx(x):
    """
    Approximate cosine to avoid math import and keep dependency small.
    Cos(x) around 0-2*pi.
    """
    import math
    return math.cos(x)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/weather")
def get_weather():
    city = request.args.get("city", "New Delhi").strip()
    if not city:
        return jsonify({"error": "City name is required"}), 400
        
    api_key = request.args.get("key") or request.headers.get("X-API-Key") or os.environ.get("OPENWEATHER_API_KEY")
    
    # If API key exists, try fetching real data
    if api_key:
        try:
            # 1. Fetch current weather
            curr_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
            curr_res = requests.get(curr_url)
            if curr_res.status_code == 200:
                curr_data = curr_res.json()
                lat = curr_data["coord"]["lat"]
                lon = curr_data["coord"]["lon"]
                
                # 2. Fetch forecast data (5-day / 3-hour)
                forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"
                forecast_res = requests.get(forecast_url)
                
                # Convert weather ID to unified condition
                weather_id = curr_data["weather"][0]["id"]
                condition = "Cloudy"
                if weather_id >= 200 and weather_id < 300:
                    condition = "Stormy"
                elif weather_id >= 300 and weather_id < 600:
                    condition = "Rainy"
                elif weather_id >= 600 and weather_id < 700:
                    condition = "Snowy"
                elif weather_id == 800:
                    condition = "Sunny"
                elif weather_id > 800:
                    condition = "Cloudy"
                elif weather_id >= 700 and weather_id < 800:
                    condition = "Windy"
                    
                # Formulate local time
                timezone_offset = curr_data.get("timezone", 0)
                city_time = datetime.utcnow() + timedelta(seconds=timezone_offset)
                
                # Map forecasts
                hourly = []
                daily = []
                
                if forecast_res.status_code == 200:
                    forecast_data = forecast_res.json()
                    
                    # Gather hourly (first 8 points = 24 hours in 3-hour intervals)
                    for item in forecast_data["list"][:8]:
                        # Hour time representation
                        item_time = datetime.utcfromtimestamp(item["dt"]) + timedelta(seconds=timezone_offset)
                        hourly.append({
                            "time": item_time.strftime("%H:00"),
                            "temp": round(item["main"]["temp"], 1),
                            "icon": item["weather"][0]["icon"],
                            "condition": item["weather"][0]["main"],
                            "description": item["weather"][0]["description"]
                        })
                    
                    # Gather daily (group by day)
                    days_seen = {}
                    for item in forecast_data["list"]:
                        item_time = datetime.utcfromtimestamp(item["dt"]) + timedelta(seconds=timezone_offset)
                        day_name = item_time.strftime("%A")
                        day_date = item_time.strftime("%b %d")
                        
                        if day_date not in days_seen:
                            days_seen[day_date] = {
                                "day": "Today" if len(days_seen) == 0 else day_name,
                                "date": day_date,
                                "temp_min": item["main"]["temp_min"],
                                "temp_max": item["main"]["temp_max"],
                                "icon": item["weather"][0]["icon"],
                                "condition": item["weather"][0]["main"],
                                "description": item["weather"][0]["description"]
                            }
                        else:
                            # Update min and max temps
                            days_seen[day_date]["temp_min"] = min(days_seen[day_date]["temp_min"], item["main"]["temp_min"])
                            days_seen[day_date]["temp_max"] = max(days_seen[day_date]["temp_max"], item["main"]["temp_max"])
                    
                    daily = list(days_seen.values())[:7]
                
                # Setup UV index (mocked since it requires separate One Call API key which is usually paid)
                uv = 5 if condition == "Sunny" else (2 if condition == "Cloudy" else 0)
                
                return jsonify({
                    "city": curr_data["name"],
                    "country": curr_data["sys"]["country"],
                    "temperature": round(curr_data["main"]["temp"], 1),
                    "feels_like": round(curr_data["main"]["feels_like"], 1),
                    "temp_min": round(curr_data["main"]["temp_min"], 1),
                    "temp_max": round(curr_data["main"]["temp_max"], 1),
                    "condition": condition,
                    "description": curr_data["weather"][0]["description"],
                    "humidity": curr_data["main"]["humidity"],
                    "wind_speed": round(curr_data["wind"]["speed"], 1),
                    "uv_index": uv,
                    "pressure": curr_data["main"]["pressure"],
                    "visibility": round(curr_data.get("visibility", 10000) / 1000, 1),
                    "icon": curr_data["weather"][0]["icon"],
                    "local_time": city_time.strftime("%I:%M %p"),
                    "local_date": city_time.strftime("%A, %B %d"),
                    "hourly": hourly if hourly else [{"time": city_time.strftime("%H:00"), "temp": round(curr_data["main"]["temp"], 1), "icon": curr_data["weather"][0]["icon"], "condition": condition, "description": curr_data["weather"][0]["description"]}],
                    "daily": daily if daily else [{"day": "Today", "date": city_time.strftime("%b %d"), "temp_min": round(curr_data["main"]["temp_min"], 1), "temp_max": round(curr_data["main"]["temp_max"], 1), "icon": curr_data["weather"][0]["icon"], "condition": condition, "description": curr_data["weather"][0]["description"]}],
                    "provider": "openweathermap"
                })
        except Exception as e:
            # Fallback to mock if API key exists but call fails (e.g. connection error or invalid key)
            print(f"OpenWeatherMap request failed: {e}. Falling back to mock data.")
            pass
            
    # Default fallback to mock data
    return jsonify(generate_mock_weather(city))

if __name__ == "__main__":
    app.run(debug=True, port=5000)
