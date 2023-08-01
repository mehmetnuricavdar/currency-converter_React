import React, { useState, useEffect } from "react";
import "./CurrencyFunction.css";
import { CurrencyList } from "./CurrencyList";
import { convertUpToDown, convertDownToUp } from "./conversionFunctions";

function CurrencyFunction() {
  const [selectedUpValue, setSelectedUpValue] = useState("");
  const [selectedDownValue, setSelectedDownValue] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [timeLastUpdate, setTimeLastUpdate] = useState(null);
  const [inputUpValue, setInputUpValue] = useState("");
  const [inputDownValue, setInputDownValue] = useState("");

  const URLCurrency = "https://open.er-api.com/v6/latest/";

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (selectedUpValue && selectedDownValue) {
        try {
          const response = await fetch(`${URLCurrency}${selectedUpValue}`);
          const data = await response.json();
          setExchangeRate(data.rates[selectedDownValue]);
          setTimeLastUpdate(data.time_last_update_utc);
        } catch (error) {
          console.error(error);
        }
      }
    };

    const updateConversionValues = () => {
      if (exchangeRate !== null && inputUpValue !== "") {
        setInputDownValue(
          convertUpToDown(parseFloat(inputUpValue), exchangeRate)
        );
      }
      if (exchangeRate !== null && inputDownValue !== "") {
        setInputUpValue(
          convertDownToUp(parseFloat(inputDownValue), exchangeRate)
        );
      }
    };

    fetchExchangeRate();
    updateConversionValues();
  }, [
    selectedUpValue,
    selectedDownValue,
    exchangeRate,
    inputUpValue,
    inputDownValue,
  ]);

  const handleSelectUpChange = (event) => {
    const selectedCurrency = event.target.value;
    setSelectedUpValue(selectedCurrency);
  };

  const handleSelectDownChange = (event) => {
    const selectedCurrency = event.target.value;
    setSelectedDownValue(selectedCurrency);
  };

  const handleUpInputChange = (event) => {
    setInputUpValue(event.target.value);
  };

  const handleDownInputChange = (event) => {
    setInputDownValue(event.target.value);
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
          {timeLastUpdate ? `Last updated: ${timeLastUpdate}` : "Loading..."}
        </div>
      </div>
    </div>
  );
}

export { CurrencyFunction };