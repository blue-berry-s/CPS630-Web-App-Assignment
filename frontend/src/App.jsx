import { useState } from "react";
import './App.css';
import './css/defaultStyle.css';

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AddEvent from "./pages/AddEvent/AddEvent";
import CampusMap from "./pages/CampusMap/CampusMap";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
// import StaffHome from "./pages/StaffHome/StaffHome";


function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  // Not logged in
  if (!user) {
    return <Login setPage={setPage} setUser={setUser} />;
  }

  // Page routing
  if (page === "addEvent") return <AddEvent setPage={setPage} />;
  if (page === "campusMap") return <CampusMap setPage={setPage} />;
  if (page === "profilePage") return <ProfilePage setPage={setPage} user={user} setUser={setUser} />;


  if (user.role === "staff") return <Home setPage={setPage} user={user} />; // will change to staff page later
  else return <Home setPage={setPage} user={user} />;

  return null;
}

export default App;