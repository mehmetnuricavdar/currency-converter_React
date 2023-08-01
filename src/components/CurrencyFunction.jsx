// CurrencyFunction.js
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

  const URLCurrency = "https://open.er-api.com/v6/latest/";

  useEffect(() => {
    if (selectedUpValue && selectedDownValue) {
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
    }
  };

  const handleSelectUpChange = (event) => {
    const selectedCurrency = event.target.value;
    setSelectedUpValue(selectedCurrency);
  };

  const handleSelectDownChange = (event) => {
    const selectedCurrency = event.target.value;
    setSelectedDownValue(selectedCurrency);
  };

  const handleUpInputChange = (event) => {
    const inputValue = parseFloat(event.target.value);
    setInputUpValue(event.target.value);

    if (!isNaN(inputValue) && exchangeRate !== null) {
      setInputDownValue(convertUpToDown(inputValue, exchangeRate));
    }
  };

  const handleDownInputChange = (event) => {
    const inputValue = parseFloat(event.target.value);
    setInputDownValue(event.target.value);

    if (!isNaN(inputValue) && exchangeRate !== null) {
      setInputUpValue(convertDownToUp(inputValue, exchangeRate));
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
            <CurrencyList
              className="list-up"
              value={selectedUpValue}
              onChange={handleSelectUpChange}
            />
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
            <CurrencyList
              className="list-down"
              id="currency-to-list"
              value={selectedDownValue}
              onChange={handleSelectDownChange}
            />
          </div>
        </div>
        <div className="time-div">
          {exchangeRate !== null
            ? `1 ${selectedUpValue} = ${exchangeRate} ${selectedDownValue}`
            : "Loading..."}
        </div>
        <div className="time-div">
          {timeLastUpdate ? `Last updated: ${timeLastUpdate}` : ""}
        </div>
      </div>
    </div>
  );
}

export { CurrencyFunction };
