import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SidebarContext } from './DashboardLayout';

function Sidebar(props) {


    const sidebarContext = useContext(SidebarContext);
    const { showSidebar } = sidebarContext;

    return (
        <Wrapper showSidebar={showSidebar}>
            <Menu>
                <MenuItem><LinkMenuItem>Item 1</LinkMenuItem></MenuItem>
                <MenuItem><LinkMenuItem>Item 2</LinkMenuItem></MenuItem>
                <MenuItem><LinkMenuItem>Item 3</LinkMenuItem></MenuItem>
                <MenuItem><LinkMenuItem>Item 4</LinkMenuItem></MenuItem>
                <MenuItem><LinkMenuItem>Item 5</LinkMenuItem></MenuItem>
            </Menu>
        </Wrapper>
    );
}

export default Sidebar;


const Wrapper = styled.nav`
    position: fixed;
    top: 0;
    left: ${props => props.showSidebar ? 0 : '-230px'};
    width: 270px;
    height: 100vh;
    overflow-y: auto;
    margin-top: 60px;
    background-color: #FEFEFE;
    transition: left .3s;
`

const Menu = styled.ul`
    padding: .2rem 0 0;
`

const MenuItem = styled.li`
    font-size: 1rem;
    font-weight: 300;
    display: block;
`
const LinkMenuItem = styled(Link)`
    display: block;
    padding: .8rem 2.5rem .8rem;
    color: black;
`
