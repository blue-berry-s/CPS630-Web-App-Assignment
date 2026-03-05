import { useState } from "react";
import './App.css';
import './css/defaultStyle.css';

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AddEvent from "./pages/AddEvent/AddEvent";
import CampusMap from "./pages/CampusMap/CampusMap";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login" && <Login setPage={setPage} />}
      {page === "home" && <Home setPage={setPage} />}
      {page === "addEvent" && <AddEvent setPage={setPage} />}
      {page === "campusMap" && <CampusMap setPage={setPage} />}
    </>
  );
}

export default App;