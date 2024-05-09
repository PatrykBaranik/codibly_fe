// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [forecastData, setForecastData] = useState([]);
  const [iterator, setIterator]  = useState([]);
  useEffect(() => {
    // Pobranie lokalizacji użytkownika
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherForecast(latitude, longitude);
    });
  }, []);

  const fetchWeatherForecast = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://codibly-be.onrender.com/weather-forecast?latitude=${latitude}&longitude=${longitude}`);
      setForecastData(response.data);
      setIterator([0,1,2,3,4,5,6]);
      console.log(response.data);
    } catch (error) {
      console.error('Błąd pobierania prognozy pogody:', error);

    }
  };

  function roundTo(number) {
    return +(Math.round(number + "e+2") + "e-2");
  }

  function getIcon(number) {
    // eslint-disable-next-line import/no-webpack-loader-syntax
    var data = require('./iconsJson.json');
    return data[number]["day"]["image"]
  }

  return (
    <div className="App">
      <h1>Prognoza pogody na najbliższe 7 dni</h1>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Ikona pogody</th>
            <th>Min. temp [°C]</th>
            <th>Max. temp [°C]</th>
            <th>Wyprodukowana energia [kWh]</th>
          </tr>
        </thead>
        <tbody>
          {iterator.map((day, index) => (
            <tr key={index}>
              <td>{forecastData['date'][index].slice(0, -13)}</td>
              <td><img src={getIcon(forecastData['weather_code'][index])}/></td>
              <td>{Math.round(forecastData['min_temperature'][index])}</td>
              <td>{Math.round(forecastData['max_temperature'][index])}</td>
              <td>{roundTo(forecastData['energy_generated_kwh'][index], 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

