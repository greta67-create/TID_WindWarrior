export default function getWeatherIcon(weather) {
  const key = weather.toLowerCase(); // handle "Cloudy", "CLOUDY", etc.

  const weathertypemap = {
    rainy: "🌧️",
    cloudy: "☁️",
    sunny: "☀️",
    clear: "🌤️",
  };

  return weathertypemap[key] || "🌈"; // fallback
}
