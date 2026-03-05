import { useState, useEffect } from 'react';
import TMUMap from '../../assets/TMUMap.svg';
import './Map.css';

const locations = [
  { id: "MAC", x: 59.9, y: 6.8 },
  { id: "KHB", x: 56.8, y: 44 },
  { id: 'JOR', x: 45.75, y: 43.8 },
  { id: 'POD', x: 45.75, y: 53.2 },
  { id: 'LIB', x: 45.75, y: 63.3 },
  { id: 'SLC', x: 40.62, y: 61.2 },
  { id: 'RAC', x: 56.82, y: 56.94 },
  { id: 'EPH', x: 71.75, y: 45.27 },
  { id: 'RCC', x: 73.37, y: 63 },
  { id: 'ENG', x: 67.4, y: 74.59 },
  { id: 'DCC', x: 62.16, y: 84.88 },
  { id: 'VIC', x: 50.7, y: 85.70 },
  { id: 'TRS', x: 27.40, y: 94.32 },
  { id: 'DSQ', x: 45.2, y: 83.8 },
]

function Map() {
  const [selectedId, setSelectedId] = useState("MAC");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/events')
      .then(response => response.text())
      .then(text => console.log(text))
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div id="events">
        <h1>Events Happening On Campus</h1>

        <div className="map-wrapper">
          <img src={TMUMap} alt="Map of TMU"></img>

          {locations.map((loc) => (
            <button
              key={loc.id}
              className={`pin-button ${selectedId === loc.id ? 'active' : ''}`}
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                position: 'absolute'
              }}
              onClick={() => setSelectedId(loc.id)}
            />
          ))}
        </div>


        <div id="locEvents">
          <h2 id="location">Events at {selectedId}</h2>
          <div>
            {events.map(event => (
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Map;