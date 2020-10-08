import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SidebarContext } from './DashboardLayout';
import { coordenador } from "../userType";

import { AiOutlineHome } from "react-icons/ai";

function Sidebar(props) {

    const sidebarContext = useContext(SidebarContext);
    const { showSidebar } = sidebarContext;



    return (
        <Wrapper showSidebar={showSidebar}>
            <Menu>
                {coordenador.map(({ icon, description, to }) =>
                    <MenuItem><LinkMenuItem to={to}>{icon} <span>{description}</span> </LinkMenuItem></MenuItem>
                )}
            </Menu>
        </Wrapper>
    );
}

export default Sidebar;


const Wrapper = styled.nav`
    position: fixed;
    top: 0;
    left: ${props => props.showSidebar ? 0 : '-230px'};
    width: 256px;
    height: 100vh;
    overflow-y: auto;
    margin-top: 60px;
    background-color: #FEFEFE;
    transition: left .3s;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
`

const Menu = styled.ul`
    padding: 0;
`

const MenuItem = styled.li`
    font-size: .95rem;
    font-weight: 300;
    display: block;
`
const LinkMenuItem = styled(Link)`
    display: block;
    padding: .6rem 2.5rem .6rem 1.7rem;
    color: rgba(0, 0, 0, .75);
    color: #444444;
    position: relative;

    svg{
        width: 20px;
        height: auto;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }

    span{
        padding-left: 30px;
        z-index: 5;
    }

    ::before{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

    &:hover{
        color: ${props => props.theme.color.primary};
        font-weight: 400;
        color: white;

        ::before{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${props => props.theme.color.secondary};
            z-index: -21;
            border-radius: 0 25px 25px 0;
            
            
        }
    }
`
