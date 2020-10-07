import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Sidebar(props) {


    return (
        <Wrapper>
            <Menu>
                <MenuItem><LinkMenuItem>Home</LinkMenuItem></MenuItem>
                <MenuItem><LinkMenuItem>Home</LinkMenuItem></MenuItem>
                <MenuItem><LinkMenuItem>Home</LinkMenuItem></MenuItem>
                <MenuItem><LinkMenuItem>Home</LinkMenuItem></MenuItem>
                <MenuItem><LinkMenuItem>Home</LinkMenuItem></MenuItem>
            </Menu>
        </Wrapper>
    );
}

export default Sidebar;

const Wrapper = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 270px;
    height: 100vh;
    overflow-y: auto;
    margin-top: 60px;
    background-color: white;
`

const Menu = styled.ul`
    padding: .5rem 0 0;
`

const MenuItem = styled.li`
    font-size: 1.1rem;
    font-weight: 300;
    display: block;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    border-top: 1px solid rgba(225, 225, 225, 0.05);
`
const LinkMenuItem = styled(Link)`
    display: block;
    padding: 1rem 2.5rem 1rem;
    color: black;
`
