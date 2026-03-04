import { useState } from "react";
import './App.css';
import './css/defaultStyle.css';

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
      {page === "login" && <Login setPage={setPage} />}

      {page === "home" && <Home setPage={setPage} />}
      {page === "addEvent" && <AddEvent setPage={setPage} />} (
        <>
          {/* <Header />

          <Button 
            buttonType="btn-primary"
            text="Add Event"
          />

          <Button 
            buttonType="btn-primary"
            text="Maps"
          />

          <EventCard
            title="test title"
            description="test description"
            formattedDate="123"
            time="456"
            location="test location"
            organization="test creators"
            capacity="123/capacity"
            cost="$123"
          /> */}
        </>
      )
    </>
  );
}

export default App;