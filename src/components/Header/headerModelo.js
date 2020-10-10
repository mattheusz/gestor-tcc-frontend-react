import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi'
import Avatar from 'react-avatar';
import lightTheme from '../themes/light'
import { SidebarContext } from "../DashboardUI";
import Brand from '../Brand'



function HeaderDashboard(props) {

    const sidebarContext = useContext(SidebarContext);
    const { setShowSidebar } = sidebarContext;

    return (
        <Header>
            <LinkToHome to='/home'>
                <Brand>
                    Gestor de <span>TCC</span>
                </Brand>
            </LinkToHome>
            <Hamburguer onClick={() => console.log(setShowSidebar())} />
            <CustomAvatar
                round
                color={lightTheme.color.primary}
                size='2.5rem'
                textSizeRatio={1.5}
                name='Matheus Justino'
            />
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
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    z-index: 5;
`
const LogoDashboard = styled(Logo)`
    display: inline-block;
    font-size: 1.6rem;
    margin: 0;
    margin-left: 15px;
`
const LinkToHome = styled(Link)`

`

const Hamburguer = styled(FiMenu)`
    position: absolute;
    left: 208px;
    color: ${props => props.theme.color.primary};
    font-size: 1.6rem;
    cursor: pointer;
    transition: all .3s;

    &:hover{
        color: ${props => props.theme.color.secondary};
        font-weight: 400;
    }
`

const CustomAvatar = styled(Avatar)`
    margin-right: 15px;
`