import logo from "./logo.svg";
import "./App.css";
import { CurrencyConverter } from "./components/CurrencyConverter";
import { CurrencyFunction } from "./components/CurrencyFunction";

function App() {
  return <div className="App">
    <CurrencyFunction />
    {/* <CurrencyConverter /> */}
  </div>;
}

export default App;
