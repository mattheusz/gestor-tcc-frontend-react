import React from 'react'
import styled from 'styled-components';
import lightTheme from '../../themes/light'
import Brand from '../Brand';
import Hamburguer from '../Hamburguer';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import { headerStyle } from './styles'

function Header({ setShowSidebar }) {

    return (
        <header style={headerStyle}>
            <Link to='/home' style={{ marginLeft: '15px' }}>
                <Brand >
                    Gestor de <span>TCC</span>
                </Brand>
            </Link>
            <Hamburguer onClick={() => console.log(setShowSidebar())} />
            <Avatar
                style={{ marginRight: '15px' }}
                round
                color={lightTheme.color.primary}
                size='2.5rem'
                textSizeRatio={1.5}
                name='Matheus Justino'
            />
        </header>
    );
}

export default Header;