import React, { memo, useRef } from 'react'
import styled from 'styled-components';
import lightTheme from '../../themes/light'
import Brand from '../Brand';
import Hamburguer from '../Hamburguer';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import { headerStyle } from './styles'
import { device } from '../../device';


function Header({ setShowSidebar, setShowDropdown }) {
    let profileImageUrl = useRef();
    profileImageUrl.current = localStorage.getItem('urlProfileImage');
    let userName = useRef();
    userName.current = localStorage.getItem('username');

    return (
        <header style={headerStyle}>

            <Link to='/home' style={{ marginLeft: '15px' }}>
                <Brand >
                    Gestor de <span>TCC</span>
                </Brand>
            </Link>

            <HeaderSideRight>
                <ChangeVision>

                </ChangeVision>
                <Hamburguer onClick={() => setShowSidebar()} />
                <StyledAvatar
                    round
                    color={lightTheme.color.primary}
                    size='2.5rem'
                    textSizeRatio={1.5}
                    name={userName.current}
                    style={{
                        cursor: 'pointer',
                    }}
                    onClick={() => { setShowDropdown() }}
                    src={profileImageUrl.current}
                />
            </HeaderSideRight>
        </header >
    );
}

export default Header;

const StyledAvatar = memo(styled(Avatar)`
    display: none !important;

    @media ${device.mobileL}{
        display: none !important;
        margin-right: 15px;
    }

    @media ${device.tablet}{
        display: block !important;
        margin-right: 15px;
    }
`)

const HeaderSideRight = styled.div`
    display: flex;
    align-items: center;
    font-size: 15.4px;
`;

const ChangeVision = styled.div`
    margin-right: 15px;
    color: ${props => props.theme.color.dark};
    cursor: pointer;
    padding: 10px;
    border: 1px solid transparent;  

    &:hover{
        border-radius: 5px;
    }
`;