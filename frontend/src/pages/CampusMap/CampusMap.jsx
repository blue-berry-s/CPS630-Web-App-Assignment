import Header from '../../components/Header/Header';
import Map from './Map.jsx';

function CampusMap({ setPage }) {
  return (
    <>
      <Header setPage={setPage} />
      <Map />
    </>
  )
}

export default CampusMap;