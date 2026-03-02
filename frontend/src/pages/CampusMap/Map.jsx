import { useState } from 'react';
import TMUMap from '../../assets/TMUMap.svg';
import './Map.css';

const locations = [
  { id: "MAC", x: 59.9, y: 5.8 },
  { id: "KHB", x: 56.8, y: 44 },
  { id: 'JOR', x: 45.75, y: 43.8 },
  { id: 'POD', x: 45.75, y: 53.2 },
  { id: 'LIB', x: 45.75, y: 63.3 },
  { id: 'SLC', x: 40.62, y: 61.2 },
  { id: 'RAC', x: 56.82, y: 56.94 },
  { id: 'EPH', x: 71.75, y: 44.27 },
  { id: 'RCC', x: 70.37, y: 64.79 },
  { id: 'ENG', x: 67.4, y: 74.59 },
  { id: 'DCC', x: 62.16, y: 84.88 },
  { id: 'VIC', x: 50.7, y: 85.70 },
  { id: 'TRS', x: 27.40, y: 94.32 },
  { id: 'DSQ', x: 45.2, y: 83.8 },
]

function Map() {
  const [selectedId, setSelectedId] = useState("MAC");

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
                setSelectedId(loc.id);


              }}
            />
          ))}
        </div>

      </div>
    </>
  )
}

export default Map;