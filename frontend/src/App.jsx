import { useState } from "react";
import './App.css';
import './css/defaultStyle.css';

import CampusMap from './pages/CampusMap/CampusMap'
import Header from './components/Header/Header'
import Button from './components/Button/Button'
// import Header from './components/Header/Header';
// import Button from './components/Button/Button';
// import EventCard from './components/EventCard/EventCard';
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AddEvent from "./pages/AddEvent/AddEvent"

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <CampusMap />
    </>
  );
}

export default App;