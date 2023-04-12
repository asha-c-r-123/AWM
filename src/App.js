import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import Home from "./home";
import RoutesNav from "./routesNav";

function App() {
  return (
    <div className="App">
      <React.StrictMode>
        <BrowserRouter>
          <RoutesNav />
          {/* <Home /> */}
        </BrowserRouter>
      </React.StrictMode>
    </div>
  );
}

export default App;
