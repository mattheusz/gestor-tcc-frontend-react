import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import lightTheme from '../../themes/light'
import { coordenador } from "../../userType";
import Menu from './Menu/Menu';
import MenuItem from './MenuItem/MenuItem';
import LinkMenuItem from './LinkMenuItem';
import { Nav } from './styles';
import Avatar from 'react-avatar';

function Sidebar({ showSidebar }) {

    return (
        <Nav showSidebar={showSidebar}>
            <Menu>
                {coordenador.map(({ icon, description, to }, index) =>
                    <MenuItem key={index}>
                        <LinkMenuItem to={to}>{icon} <span>{description}</span> </LinkMenuItem>
                    </MenuItem>
                )}
                <MenuItem key={11}>
                    <LinkMenuItem to='/'>
                        <StyledAvatar
                            style={{ paddingLeft: '0px !important' }}
                            round
                            color={lightTheme.color.primary}
                            size='1.8rem'
                            textSizeRatio={.1}
                            name='Matheus Justino'
                        />
                        <Description>Matheus Justino</Description>
                    </LinkMenuItem>

                </MenuItem>
            </Menu>
        </Nav>
    );
}

const StyledAvatar = styled(Avatar)`
    
    span{
        padding-left: 0;
    }
`
const Description = styled.span` 
   padding-left: 5px !important;
`

export default Sidebar;



