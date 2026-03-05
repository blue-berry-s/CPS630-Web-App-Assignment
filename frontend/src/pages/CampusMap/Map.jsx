import { useState, useEffect } from 'react';
import TMUMap from '../../assets/TMUMap.svg';
import CompactCard from './CompactCard.jsx';
import './Map.css';

const locations = [
  { id: "MAC", x: 59.9, y: 6.8, name: "Mattamy Athletic Centre" },
  { id: "KHB", x: 56.8, y: 44, name: "Kerr Hall Building" },
  { id: 'JOR', x: 45.75, y: 43.8, name: "Jorgenson Hall" },
  { id: 'POD', x: 45.75, y: 53.2, name: "Podium" },
  { id: 'LIB', x: 45.75, y: 63.3, name: "Library Building" },
  { id: 'SLC', x: 40.62, y: 61.2, name: "Student Learning Center" },
  { id: 'RAC', x: 56.82, y: 56.94, name: "Recreation and Athletics Centre" },
  { id: 'EPH', x: 71.75, y: 45.27, name: "Eric Palin Hall" },
  { id: 'RCC', x: 73.37, y: 63, name: "Rogers Communications Centre" },
  { id: 'ENG', x: 67.4, y: 74.59, name: "George Vari Engineering and Computing Centre" },
  { id: 'DCC', x: 62.16, y: 84.88, name: "Daphne Cockwell Complex" },
  { id: 'VIC', x: 50.7, y: 85.70, name: "Victoria Building" },
  { id: 'TRS', x: 27.40, y: 94.32, name: "Ted Rogers School of Management" },
  { id: 'DSQ', x: 45.2, y: 83.8, name: "Yonge-Dundas Square" },
]

function Map() {
  const [selectedId, setSelectedId] = useState("MAC");
  const [selectedLoc, setSelectedLoc] = useState("Mattamy Athletic Centre");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
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
              onClick={() => {
                setSelectedId(loc.id)
                setSelectedLoc(loc.name)
              }}
            />
          ))}
        </div>

        <div id="locEvents">
          <h2>{selectedLoc}</h2>
          <div id="eventDisplay">
            {events
              .filter(event => event.building === selectedId)
              .map((event, idx) => (
                <div key={event._id} className="map-page-card">
                  <CompactCard
                    key={event._id}
                    {...event}
                    isCompact={true} // This "removes" the extra things for this page only
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Map;