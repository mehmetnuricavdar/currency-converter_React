(function () {
  ("use strict");
  // variables
  const resultArea = document.querySelector(".result");
  const timeDiv = document.querySelector(".time-div");
  const selectedUp = document.querySelector(".list-up");
  const selectedDown = document.querySelector(".list-down");
  const upInput = document.querySelector(".input-up");
  const downInput = document.querySelector(".input-down");
  let selectedUpValue;
  let selectedDownValue;
  let URLCurrency = "https://open.er-api.com/v6/latest/";

  //fetching API and calculations
  const getExchange = async (from, to) => {
    //default value for EUR
    if (from === undefined) {
      from = "EUR";
    }
    return fetch(`${URLCurrency}${from}`)
      .then((response) => response.json())
      .then((data) => {
        let selectedCurrency;
        let exRate;
        let rateEl = document.createElement("h3");
        let timeEl = document.createElement("h6");

        // default value for DKK
        if (to === undefined) {
          selectedCurrency = "DKK";
          exRate = data.rates.DKK;
          document.querySelector(".down-span").textContent = "DKK";
          rateEl.textContent = `1 ${from} equals ${exRate.toFixed(3)} DKK`;
          resultArea.appendChild(rateEl);
          timeEl.textContent = data.time_last_update_utc;
          timeDiv.appendChild(timeEl);
        } else {
          selectedCurrency = to;
          exRate = data.rates[selectedCurrency];
          rateEl.textContent = `1 ${from} equals ${exRate.toFixed(3)} ${to}`;
          resultArea.appendChild(rateEl);
        }
        //checking error
        if (!exRate) {
          throw new Error(`Currency not available: ${selectedCurrency}`);
        }
        return {
          exRateObj: data.rates[selectedCurrency],
          timeObj: data.time_last_update_utc,
        };
      })
      .then(conversion);
  };
  //conversion function
  const conversion = (data) => {
    if (resultArea.children.length > 1) {
      resultArea.removeChild(resultArea.children[0]);
    }
    if (timeDiv.children.length > 1) {
      timeDiv.removeChild(timeDiv.children[0]);
    }
    let firstAmount = upInput.value;
    const exRate = data.exRateObj;
    const convertedAmount = exRate * firstAmount;
    downInput.value = convertedAmount.toFixed(2);
    //realtime calculations for both side
    upInput.addEventListener("keyup", () => {
      const newConvertedAmount = exRate * upInput.value;
      downInput.value = newConvertedAmount.toFixed(2);
    });

    downInput.addEventListener("keyup", () => {
      const reciprocalRate = 1 / exRate;
      const equivalentAmount = downInput.value * reciprocalRate;
      upInput.value = equivalentAmount.toFixed(2);
    });
  };
  //selection of currency works calculates in realtime
  const selectionOfCurrencies = () => {
    selectedUp.addEventListener("change", () => {
      selectedUpValue = selectedUp.value;
      document.querySelector(".up-span").textContent = selectedUpValue;
      getExchange(selectedUpValue, selectedDownValue);
    });

    selectedDown.addEventListener("change", () => {
      selectedDownValue = selectedDown.value;
      document.querySelector(".down-span").textContent = selectedDownValue;

      getExchange(selectedUpValue, selectedDownValue);
    });
  };
  selectionOfCurrencies();
})();
