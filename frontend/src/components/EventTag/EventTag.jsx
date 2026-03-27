import './EventTag.css';

function EventTag({label, onClick}){
    return (
        <>
            <p className="tag" onClick={onClick}>{label}</p>
        </>
    );
}

export default EventTag;