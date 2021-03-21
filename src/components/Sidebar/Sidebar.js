import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import lightTheme from '../../themes/light'
import { coordenador, professor, alunoPreProjeto, alunoOrientando, administrativo, coordenadorProfessor } from "../../userType";
import Menu from './Menu/Menu';
import MenuItem from './MenuItem/MenuItem';
import LinkMenuItem from './LinkMenuItem';
import { Nav } from './styles';
import Avatar from 'react-avatar';
import { AuthContext } from '../../context/AuthContext';

let userType = localStorage.getItem('userType');

function menuToBeDisplayed() {
    userType = localStorage.getItem('userType');
    const mode = localStorage.getItem('professorMode');

    console.debug('USER TYPE', userType, 'MODE', mode);
    if (userType === 'professor') {
        // corrigir aqui depois que for alterado na API
        return professor;
    }
    else if (userType === 'coordenador' && (mode === 'true')) {
        return coordenadorProfessor;
    }
    else if (userType === 'coordenador' && (mode === 'false')) {
        return coordenador;
    }
    else if (userType === 'coordenador') {
        return coordenador;
    }
    else if (userType === 'aluno-pre') {
        return alunoPreProjeto;
    }
    else if (userType === 'aluno-orientando') {
        return alunoOrientando;
    }
    else if (userType === 'administrativo') {
        return administrativo;
    }
}

function Sidebar({ showSidebar, itemActive }) {

    const { professorMode, updateProfessorModeLocalAndState } = useContext(AuthContext);

    let profileImageUrl = useRef();
    profileImageUrl.current = localStorage.getItem('urlProfileImage');

    let userName = useRef();
    userName.current = localStorage.getItem('username');

    const menu = menuToBeDisplayed();


    return (
        <Nav showSidebar={showSidebar}>
            <Menu>
                {menu.map(({ icon, description, to }, index) => {
                    if (description === "Visão Professor" || description === "Visão Coordenador") {
                        console.debug('USER TYPE RENDERING', userType)
                        if (userType === 'coordenador') {
                            return description === "Visão Professor" ?
                                <MenuItem key={index}>
                                    <LinkMenuItem onClick={() => updateProfessorModeLocalAndState(true)} to={to} changeMode='true' >{icon} <span>{description}</span> </LinkMenuItem>
                                </MenuItem> :
                                <MenuItem key={index}>
                                    <LinkMenuItem onClick={() => updateProfessorModeLocalAndState(false)} to={to} changeMode='true' >{icon} <span>{description}</span> </LinkMenuItem>
                                </MenuItem>
                        } else
                            return;
                    }
                    else if (description === itemActive)
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
                    <LinkMenuItem to='/perfil'>
                        <StyledAvatar
                            style={{ paddingLeft: '0px !important' }}
                            round
                            color={lightTheme.color.primary}
                            size='1.8rem'
                            textSizeRatio={.1}
                            name={userName.current}
                            src={profileImageUrl.current}
                        />
                        <Description>{userName.current}</Description>
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



