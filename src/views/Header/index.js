import { useEffect } from 'react';
import WebFont from 'webfontloader';
import './style.css';

function Header() {
    useEffect(() => {
        WebFont.load({
          google: {
            families: ['Noto Sans']
          }
        });
       }, []);
    
    return (
        <header>
            <h1 className="font-face-ns">chess visualization</h1>
        </header>
    )
}

export default Header;