import EventTag from '../EventTag/EventTag';
import './CardTagDisplay.css';

function CardTagDisplay({ tags }) {
  return (
    <div className="category-bar">
      {tags.map((tag) => (
        <EventTag key={tag} label={tag} onClick={()=>{}}/>
      ))}
    </div>
  );
}

export default CardTagDisplay;