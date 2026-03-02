import './App.css'
import "./css/defaultStyle.css";

import Header from './components/Header/Header'
import Button from './components/Button/Button'

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
    </>
  )
}

export default App
