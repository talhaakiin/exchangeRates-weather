import axios from "axios";
import React, { useEffect, useState } from "react";
import "../src/App.css";

// CurrencySelect Component
function CurrencySelect({ data }) {
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [number, setNumber] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");

  const extractCurrencyCodes = (data) => {
    if (!data || !data.rates) {
      return [];
    }
    const currencies = Object.keys(data.rates);
    return currencies;
  };

  const handleSelectChange = (event) => {
    const selected = event.target.value;
    setSelectedCode(selected);
    setConvertedAmount("");
    if (data && data.rates) {
      const rate = data.rates[selected];
      setSelectedCurrency(rate || null);
    } else {
      setSelectedCurrency(null);
    }
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleCalculate = () => {
    if (selectedCurrency && number) {
      // TL cinsinden girilen değeri seçilen para birimine çevir
      const converted = number / selectedCurrency;
      setConvertedAmount(converted);
    }
  };

  const currencyCodes = extractCurrencyCodes(data);

  return (
    <div>
      <input
        type="number"
        className="w-1/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mx-10 my-5"
        onChange={handleNumberChange}
        value={number}
        placeholder="Miktar girin"
      />

      <select
        className="mx-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        value={selectedCode}
        onChange={handleSelectChange}
      >
        <option value="">Bir para birimi seçin</option>
        {currencyCodes.map((code, index) => (
          <option key={index} value={code}>
            {code}
          </option>
        ))}
      </select>

      <button
        className="bg-blue-500 text-white py-2 px-20 rounded-lg my-4 mx-20"
        onClick={handleCalculate}
      >
        Hesapla
      </button>

      {convertedAmount && (
        <p className="m-auto text-black text-center bg-white-300 rounded-xl w-auto">
          {number} {selectedCode} = {convertedAmount.toFixed(2)} TL
        </p>
      )}
    </div>
  );
}

// Weather Component
function Weather() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("Istanbul"); // Default location

  const API_KEY = "9acb972e5420c4dc1bf9511e1f838225";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios
        .get(url)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching weather data: ", error);
        });
      setLocation("");
    }
  };

  useEffect(() => {
    // Fetch weather data for the default location when the component mounts
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching default weather data: ", error);
      });
  }, []); // Empty dependency array to run only on component mount

  return (
    <div className="w-full h-full relative items-end">
      <div className="text-center p-4 items-center px-10">
        <input
          type="text"
          className="py-3 px-6 w-[300px] text-lg rounded-3xl border-gray-200 text-gray-600"
          placeholder="Bölge Girin"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}
        />
      </div>

      {/* Display weather information */}
      {data.main && (
        <div className="w-[300px] h-[280px] bg-gray-300 shadow-lg rounded-xl mx-auto relative py-6 px-12">
          <div className="flex flex-col items-center">
            <p className="text-x1 text-black">
              {data.name}, {data.sys.country}
            </p>
            <p className="text-sm text-black">
              {data.weather[0].description}
            </p>
            <img
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="w-[120px]"
            />
            <h1 className="text-6xl font-semibold text-black">
              {data.main.temp.toFixed()} °C
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App Component
function App() {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    axios
      .get("https://api.exchangerate-api.com/v4/latest/TRY") // Base currency set to TRY
      .then((response) => {
        setJsonData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the exchange rate data: ", error);
      });
  }, []);

  return (
    <div className="App">
      <div className="m-20">
        <CurrencySelect data={jsonData} />
      </div>
      <div className="">
        <Weather />
      </div>
    </div>
  );
}

export default App;
