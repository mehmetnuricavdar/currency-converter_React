import React, { useState, useEffect } from "react";

const CurrencyConverter = () => {
  const [selectedUpValue, setSelectedUpValue] = useState("EUR");
  const [selectedDownValue, setSelectedDownValue] = useState("DKK");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [timeLastUpdate, setTimeLastUpdate] = useState(null);

  const URLCurrency = "https://open.er-api.com/v6/latest/";

  useEffect(() => {
    getExchange(selectedUpValue, selectedDownValue);
  }, [selectedUpValue, selectedDownValue]);

  const getExchange = async (from, to) => {
    if (from === undefined) {
      from = "EUR";
    }
    try {
      const response = await fetch(`${URLCurrency}${from}`);
      const data = await response.json();

      if (to === undefined) {
        setSelectedDownValue("DKK");
        setExchangeRate(data.rates.DKK);
      } else {
        setExchangeRate(data.rates[to]);
      }

      if (!exchangeRate) {
        throw new Error(`Currency not available: ${to}`);
      }

      setTimeLastUpdate(data.time_last_update_utc);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpInputChange = (event) => {
    const newConvertedAmount = exchangeRate * event.target.value;
    document.querySelector(".input-down").value = newConvertedAmount.toFixed(2);
  };

  const handleDownInputChange = (event) => {
    const reciprocalRate = 1 / exchangeRate;
    const equivalentAmount = event.target.value * reciprocalRate;
    document.querySelector(".input-up").value = equivalentAmount.toFixed(2);
  };

  return (
    <div>
      <select
        className="list-up"
        value={selectedUpValue}
        onChange={(e) => setSelectedUpValue(e.target.value)}
      >
        {/* Options for currencies */}
        {/* ... */}
      </select>
      <select
        className="list-down"
        value={selectedDownValue}
        onChange={(e) => setSelectedDownValue(e.target.value)}
      >
        {/* Options for currencies */}
        {/* ... */}
      </select>
      <input
        className="input-up"
        type="number"
        defaultValue="1"
        onChange={handleUpInputChange}
      />
      <input
        className="input-down"
        type="number"
        defaultValue={exchangeRate ? (1 / exchangeRate).toFixed(2) : ""}
        onChange={handleDownInputChange}
      />
      <div className="result">
        <h3>
          1 {selectedUpValue} equals{" "}
          {exchangeRate ? exchangeRate.toFixed(3) : ""} {selectedDownValue}
        </h3>
      </div>
      <div className="time-div">
        <h6>{timeLastUpdate}</h6>
      </div>
    </div>
  );
};

export { CurrencyConverter };
