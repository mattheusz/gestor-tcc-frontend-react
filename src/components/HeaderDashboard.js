import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Logo } from '../styled';
import { FiMenu } from 'react-icons/fi'
import Avatar from 'react-avatar';
import lightTheme from '../themes/light'



function HeaderDashboard(props) {
    return (
        <Header>
            <LinkToHome to='/home'>
                <LogoDashboard>
                    Gestor de <span>TCC</span>
                </LogoDashboard>
            </LinkToHome>
            <Hamburguer />
            <CustomAvatar
                round
                color={lightTheme.color.primary}
                size='2.5rem'
                textSizeRatio='1.5'
                name='Matheus Justino' />
        </Header>
    );
}

export default HeaderDashboard;

const Header = styled.header`
    position: fixed;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 .3px 5px grey;
    z-index: 5;
`
const LogoDashboard = styled(Logo)`
    display: inline-block;
    font-size: 1.9rem;
    margin: 0;
    margin-left: 15px;
`
const LinkToHome = styled(Link)`

`

const Hamburguer = styled(FiMenu)`
    position: absolute;
    left: 228px;
    color: ${props => props.theme.color.primary};
    font-size: 2rem;;
    cursor: pointer;
`

const CustomAvatar = styled(Avatar)`
    margin-right: 15px;
`