import { useState } from "react";
import './App.css';
import './css/defaultStyle.css';

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AddEvent from "./pages/AddEvent/AddEvent";
import CampusMap from "./pages/CampusMap/CampusMap";
<<<<<<< HEAD
// import StaffHome from "./pages/StaffHome/StaffHome";
=======
import ProfilePage from "./pages/ProfilePage/ProfilePage";
>>>>>>> origin/feature/profile-page

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

<<<<<<< HEAD
  // Not logged in
  if (!user) {
    return <Login setPage={setPage} setUser={setUser} />;
  }

  // Page routing
  if (page === "addEvent") return <AddEvent setPage={setPage} />;
  if (page === "campusMap") return <CampusMap setPage={setPage} />;

 
  if (user.role === "staff") return <Home setPage={setPage} user={user} />; // will change to staff page later
  else return <Home setPage={setPage} user={user} />;

  return null;
=======
  return (
    <>
      {page === "login" && <Login setPage={setPage} />}
      {page === "home" && <Home setPage={setPage} />}
      {page === "addEvent" && <AddEvent setPage={setPage} />}
      {page === "campusMap" && <CampusMap setPage={setPage} />}
      {page === "profilePage" && <ProfilePage setPage={setPage} />}
    </>
  );
>>>>>>> origin/feature/profile-page
}

export default App;