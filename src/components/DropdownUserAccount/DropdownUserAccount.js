import styled from 'styled-components';
import React from 'react';
import { BiUserCircle } from 'react-icons/bi';
import { AiOutlineLogout } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const StyledDropdownUserAccount = styled.div`
    position: absolute;
    top: 65px;
    right: 15px;
    width: 250px;
    padding: .5rem;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /*
    visibility: hidden;
    opacity: 0;
    */
    transition: .1s;
    z-index: 2;
    background-color: ${props => props.theme.color.primary};
    color: white;
    visibility: ${props => props.showDropdown ? 'visible' : 'hidden'}
`;

const ListItemDropdown = styled(Link)`
    padding: .6rem .3rem .6rem 1.7rem;
    list-style-type: none;
    display: block;
    color: white;
    font-size: 1.1rem;
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

    &:hover{
        color: ${props => props.theme.color.primary};
        font-weight: 400;
        color: white;

    }
`;

const ListItemDropdownLi = styled.li`
    padding: .6rem .3rem .6rem 1.7rem;
    list-style-type: none;
    display: block;
    color: white;
    font-size: 1.1rem;
    position: relative;
    cursor: pointer;

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

    &:hover{
        color: ${props => props.theme.color.primary};
        font-weight: 400;
        color: white;

    }
`;


function DropdownUserAccount({ showDropdown }) {

    const { logout } = useContext(AuthContext);

    return (
        <StyledDropdownUserAccount showDropdown={showDropdown}>
            <ListItemDropdown to='/perfil'>
                <BiUserCircle />
                <span>Perfil</span>
            </ListItemDropdown>
            <ListItemDropdown>
                <IoMdNotificationsOutline />
                <span>Notificações</span>
            </ListItemDropdown>
            <ListItemDropdownLi onClick={() => logout()}>
                <AiOutlineLogout />
                <span>Sair</span>
            </ListItemDropdownLi>
        </StyledDropdownUserAccount>
    );
}


export default DropdownUserAccount;

