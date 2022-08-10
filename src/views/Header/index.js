import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebFont from 'webfontloader';
import './style.css';

function Header() {
    const navigate = useNavigate();
    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Noto Sans']
            }
        });
    }, []);
    
    function navigateHome(){
        navigate('/')
    }

    return (
        <header>
          <div className="header">
            <h1 onClick={event => navigateHome()} className="font-face-ns">chess visualization</h1>
          </div>
        </header>
    )
}

export default Header;