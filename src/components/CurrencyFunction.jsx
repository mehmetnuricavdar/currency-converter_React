import { useState, useEffect } from "react";
import "./CurrencyFunction.css";
import { CurrencyList } from "./CurrencyList";

function CurrencyFunction() {
  const [selectedUpValue, setSelectedUpValue] = useState();
  const [selectedDownValue, setSelectedDownValue] = useState();
  const [exchangeRate, setExchangeRate] = useState(null);
  const [timeLastUpdate, setTimeLastUpdate] = useState(null);

  const URLCurrency = "https://open.er-api.com/v6/latest/";

  useEffect(() => {
    getExchange(selectedUpValue, selectedDownValue);
  }, [selectedUpValue, selectedDownValue]);

  const getExchange = async (selectedUpValue, selectedDownValue) => {
    // if (!selectedUpValue) {
    //   setSelectedUpValue("EUR");
    // }

    try {
      const response = await fetch(`${URLCurrency}${selectedUpValue}`);
      const data = await response.json();
      console.log(data.rates.se);

      //   if (!selectedDownValue) {
      //     setSelectedDownValue("USD");
      //   } else {
      setExchangeRate = data.rates.selectedDownValue;
      console.log(exchangeRate);
      setSelectedDownValue(selectedDownValue);

      if (!exchangeRate) {
        throw new Error(`Currency not available: ${selectedDownValue}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpInputChange = (event) => {
    console.log("This i up input change");
    const newConvertedAmount = exchangeRate * event.target.value;
    document.querySelector(".input-down").value = newConvertedAmount.toFixed(2);
  };

  const handleDownInputChange = (event) => {
    console.log("This i down input change");

    const reciprocalRate = 1 / exchangeRate;
    const equivalentAmount = event.target.value * reciprocalRate;
    document.querySelector(".input-up").value = equivalentAmount.toFixed(2);
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
          />
          <div className="currency-up">
            <div className="separator"></div>
            <label className="up-span">
              Select a Currency
              <CurrencyList
                className="list-up"
                value={selectedUpValue}
                onChange={(e) => {
                  console.log(e.target.value);
                  console.log("Hello from up");
                }}
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
          />
          <div className="currency-down">
            <div className="separator"></div>
            <label className="down-span">
              Select a Currency
              <CurrencyList
                className="list-down"
                id="currency-to-list"
                value={selectedDownValue}
                onChange={(e) => {
                  console.log("hello");

                  setSelectedDownValue(e.target.value);
                }}
              />
            </label>
          </div>
        </div>
        <div className="time-div">{timeLastUpdate}</div>
      </div>
    </div>
  );
}

export { CurrencyFunction };
