import './Button.css';

function Button({buttonType, text, onClick}){
    return (
        <>
            <button className={buttonType} onClick={onClick}> {text}</button>
        </>
    );
}

export default Button;