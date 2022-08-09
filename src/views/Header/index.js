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
          <div className="header">
            <h1 className="font-face-ns">chess visualization</h1>
          </div>
        </header>
    )
}

export default Header;