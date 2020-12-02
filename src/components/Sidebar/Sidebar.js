import React from 'react';
import styled from 'styled-components';
import lightTheme from '../../themes/light'
import { coordenador, professor, alunoPreProjeto, alunoOrientando, administrativo } from "../../userType";
import Menu from './Menu/Menu';
import MenuItem from './MenuItem/MenuItem';
import LinkMenuItem from './LinkMenuItem';
import { Nav } from './styles';
import Avatar from 'react-avatar';

function menuToBeDisplayed() {
    const userType = localStorage.getItem('userType');
    if (userType === 'professor') {
        // corrigir aqui depois que for alterado na API
        return professor;
    }
    if (userType === 'coordenador') {
        return coordenador;
    }
    if (userType === 'aluno-pre-projeto') {
        return alunoPreProjeto;
    }
    if (userType === 'aluno-orientando') {
        return alunoOrientando;
    }

    if (userType === 'administrativo') {
        return administrativo;
    }
}

function Sidebar({ showSidebar, itemActive }) {

    const menu = menuToBeDisplayed();


    return (
        <Nav showSidebar={showSidebar}>
            <Menu>
                {menu.map(({ icon, description, to }, index) => {
                    if (description === itemActive)
                        return <MenuItem key={index}>
                            <LinkMenuItem to={to} active='true'>{icon} <span>{description}</span> </LinkMenuItem>
                        </MenuItem>
                    else
                        return <MenuItem key={index}>
                            <LinkMenuItem to={to}>{icon} <span>{description}</span> </LinkMenuItem>
                        </MenuItem>
                }

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



