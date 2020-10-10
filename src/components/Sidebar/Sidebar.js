import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { coordenador } from "../../userType";
import Menu from './Menu/Menu';
import MenuItem from './MenuItem/MenuItem';
import LinkMenuItem from './LinkMenuItem';
import { Nav } from './styles';

function Sidebar({ showSidebar }) {

    return (
        <Nav showSidebar={showSidebar}>
            <Menu>
                {coordenador.map(({ icon, description, to }) =>
                    <MenuItem>
                        <LinkMenuItem to={to}>{icon} <span>{description}</span> </LinkMenuItem>
                    </MenuItem>
                )}
            </Menu>
        </Nav>
    );
}

export default Sidebar;



