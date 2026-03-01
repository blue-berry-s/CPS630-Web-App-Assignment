import './Header.css';

function Header() {
    return (
        <>
            <header id="nav-bar">
                <div id="left-icons">
                    <img src="./assets/logos/TMU.jpg" alt="TMU Logo" />
                    <h1>TMU EVENTS</h1>
                </div>

                <nav id="right-icons">
                    <img src="./assets/icons/home.svg" alt="Home Button" onClick={() => goTo('/')} />
                    <img src="./assets/icons/profile.svg" alt="Profile Button" />
                </nav>
            </header>
        </>
    )
}

export default Header;