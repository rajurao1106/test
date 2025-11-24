import React, { useState, useEffect, useRef } from "react";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const API_KEY = "16951efc5b5c4f09bbd84454251711";

  const fetchWeather = async (query) => {
    if (!query) return;
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=no`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError("❌ City not found");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchByLocation = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        fetchWeather(`${coords.latitude},${coords.longitude}`);
      },
      () => setError("Location access denied")
    );
  };

  useEffect(() => {
    inputRef.current?.focus();
    fetchByLocation();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-500 to-indigo-700 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-2xl shadow-xl rounded-3xl p-6 text-white transition-all">
        <h1 className="text-3xl font-semibold text-center mb-6">🌤️ Weather App</h1>

        {/* Search */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={city}
            placeholder="Search city..."
            onKeyDown={(e) => e.key === "Enter" && fetchWeather(city)}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-white/30 text-white placeholder-white/80 outline-none focus:ring-2 focus:ring-white/60"
          />
          <button onClick={() => fetchWeather(city)} className="bg-white/30 hover:bg-white/40 px-4 rounded-xl">
            🔍
          </button>
        </div>

        <button
          onClick={fetchByLocation}
          className="w-full mt-3 bg-white/25 hover:bg-white/35 py-2 rounded-xl"
        >
          📍 Use My Location
        </button>

        {/* Loading */}
        {loading && (
          <p className="text-center mt-6 animate-pulse text-lg">Loading...</p>
        )}

        {/* Error */}
        {error && <p className="text-center mt-6 text-red-200">{error}</p>}

        {/* Weather Result */}
        {weather && !loading && (
          <div className="mt-6 text-center animate-fadeIn">
            <h2 className="text-3xl font-bold">{weather.location.name}</h2>
            <img
              src={weather.current.condition.icon}
              alt=""
              className="w-28 mx-auto "
            />
            <p className="text-lg opacity-80">{weather.current.condition.text}</p>
            <p className="text-6xl font-light my-4">
              {weather.current.temp_c}°C
            </p>

            <div className="grid grid-cols-2 gap-4 *:bg-white/20 *:p-3 *:rounded-xl *:text-sm *:backdrop-blur-lg">
              <p>💧 Humidity: {weather.current.humidity}%</p>
              <p>💨 Wind: {weather.current.wind_kph} kph</p>
              <p>🔥 Feels like: {weather.current.feelslike_c}°C</p>
              <p>🌡️ UV Index: {weather.current.uv}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
