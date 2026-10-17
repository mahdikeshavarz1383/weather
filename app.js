const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.json({ message: 'Weather API is running' });
});

app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'city is required' });
  }

  try {
    const geoUrl =
      'https://geocoding-api.open-meteo.com/v1/search?count=1&name=' +
      encodeURIComponent(city);
    const geoRes = await fetch(geoUrl);
    const geo = await geoRes.json();

    if (!geo.results || geo.results.length === 0) {
      return res.status(404).json({ error: 'city not found' });
    }

    const place = geo.results[0];

    const weatherUrl =
      'https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m' +
      '&latitude=' + place.latitude +
      '&longitude=' + place.longitude;
    const weatherRes = await fetch(weatherUrl);
    const weather = await weatherRes.json();

    res.json({
      city: place.name,
      country: place.country,
      temp: weather.current.temperature_2m,
      humidity: weather.current.relative_humidity_2m,
      wind: weather.current.wind_speed_10m
    });
  } catch (err) {
    res.status(500).json({ error: 'weather service failed' });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
