import { useState, useEffect } from "react";
import "./CurrencyFunction.css";
import { CurrencyList } from "./CurrencyList";
import { convertUpToDown, convertDownToUp } from "./conversionFunctions";

function CurrencyFunction() {
  const [selectedUpValue, setSelectedUpValue] = useState("");
  const [selectedDownValue, setSelectedDownValue] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [inputUpValue, setInputUpValue] = useState("");
  const [inputDownValue, setInputDownValue] = useState("");
  const [timeLastUpdate, setTimeLastUpdate] = useState(null);
  const [loading, setLoading] = useState(false);

  const URLCurrency = "https://open.er-api.com/v6/latest/";

  // Fetch data from API
  useEffect(() => {
    if (selectedUpValue && selectedDownValue) {
      setLoading(true);
      getExchangeRate(selectedUpValue, selectedDownValue);
    }
  }, [selectedUpValue, selectedDownValue]);

  const getExchangeRate = async (selectedUpValue, selectedDownValue) => {
    try {
      const response = await fetch(`${URLCurrency}${selectedUpValue}`);
      const data = await response.json();
      setExchangeRate(data.rates[selectedDownValue]);
      setTimeLastUpdate(data.time_last_update_utc);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Select Currencies
  const handleSelectUpChange = (event) => {
    setSelectedUpValue(event.target.value);
  };

  const handleSelectDownChange = (event) => {
    setSelectedDownValue(event.target.value);
  };

  // Handle number inputs

  const handleUpInputChange = (event) => {
    const newValue = parseFloat(event.target.value);
    setInputUpValue(newValue);
    console.log(inputUpValue);
  };
  useEffect(() => {
    // Check if both currencies are selected
    if (
      !isNaN(inputUpValue) &&
      exchangeRate !== null &&
      selectedUpValue &&
      selectedDownValue
    ) {
      const convertedValue = convertUpToDown(inputUpValue, exchangeRate);
      console.log(convertedValue);
      setInputDownValue(convertedValue);
    }
  }, [inputUpValue, exchangeRate]);

  const handleDownInputChange = (event) => {
    const newValue = parseFloat(event.target.value);
    setInputDownValue(newValue);

    // Check if both currencies are selected
    if (
      !isNaN(newValue) &&
      exchangeRate !== null &&
      selectedUpValue &&
      selectedDownValue
    ) {
      const convertedValue = convertDownToUp(newValue, exchangeRate);
      setInputUpValue(convertedValue);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Calculator</h1>
      </header>

      <div className="main-div">
        <div className="result"></div>

        <div className="up-div">
          <input
            type="number"
            className="input-up"
            aria-label="from convert"
            onChange={handleUpInputChange}
            value={inputUpValue}
            placeholder="Enter amount to convert"
          />
          <div className="currency-up">
            <div className="separator"></div>
            <label className="up-span">
              {selectedUpValue ? selectedUpValue : "Select a Currency"}
              <CurrencyList
                className="list-up"
                value={selectedUpValue}
                onChange={handleSelectUpChange}
              />
            </label>
          </div>
        </div>
        <div className="down-div">
          <input
            type="number"
            className="input-down"
            aria-label="to convert"
            onChange={handleDownInputChange}
            value={inputDownValue}
            placeholder="Converted amount"
          />
          <div className="currency-down">
            <div className="separator"></div>
            <label className="down-span">
              {selectedDownValue ? selectedDownValue : "Select a Currency"}
              <CurrencyList
                className="list-down"
                id="currency-to-list"
                value={selectedDownValue}
                onChange={handleSelectDownChange}
              />
            </label>
          </div>
        </div>
        <div className="time-div">
          {loading
            ? "Loading..."
            : exchangeRate !== null
            ? `1 ${selectedUpValue} = ${exchangeRate} ${selectedDownValue}`
            : "Please enter an amount then select currencies"}
        </div>
        <div className="time-div">
          {timeLastUpdate ? `Last updated: ${timeLastUpdate}` : ""}
        </div>
      </div>
    </div>
  );
}

export { CurrencyFunction };
