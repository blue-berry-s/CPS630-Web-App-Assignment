import './App.css';
import './css/defaultStyle.css';

import Header from './components/Header/Header';
import Button from './components/Button/Button';
import EventCard from './components/EventCard/EventCard';

function App() {

  return (
    <>
      <Header />
      <Button 
        buttonType="btn-primary "
        text="Add Event"
        onClick={()=>{window.location.href = '/addEvent';}}
      />

      <Button 
        buttonType="btn-primary "
        text="Maps"
        onClick={()=>{window.location.href = '/addEvent';}}
      />

      <EventCard
        title="test title"
        description="test description"
        formattedDate="123"
        time="456"
        location="test location"
        organization="test creators"
        capacity="123/capacity"
        cost ="$123"
      />
    </>
  )
}

export default App
