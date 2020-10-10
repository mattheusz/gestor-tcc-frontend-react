import React from 'react';
import IFFLogo from '../../assets/iff.png'
import Logo from '../Logo/Logo';
import { Header } from './styles';


function BannerIFF(props) {
    return (
        <Header>
            <figure>
                <Logo src={IFFLogo} alt="IFF logo" />
            </figure>
        </Header>
    );
}

export default BannerIFF;