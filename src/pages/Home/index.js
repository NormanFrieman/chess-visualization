import { useEffect } from 'react';
import WebFont from 'webfontloader';
import './style.css'
import whitePawn from '../../assets/Chess_plt60.png';
import { Link } from 'react-router-dom';

function Home() {
    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Noto Sans']
            }
        });
    }, []);
    
    return (
        <div className='container_home'>
            <Link className='container_home_btn' to='/dashboard' state={{ level: 3 }}>
                <img src={whitePawn} alt="white pawn"/>
                <p className='font-face-ns'>3 PEÇAS</p>
            </Link>
            <Link className='container_home_btn' to='/dashboard' state={{ level: 4 }}>
                <img src={whitePawn} alt="white pawn"/>
                <p className='font-face-ns'>4 PEÇAS</p>
            </Link>
            <Link className='container_home_btn' to='/dashboard' state={{ level: 5 }}>
                <img src={whitePawn} alt="white pawn"/>
                <p className='font-face-ns'>5 PEÇAS</p>
            </Link>
        </div>
    )
}

export default Home;