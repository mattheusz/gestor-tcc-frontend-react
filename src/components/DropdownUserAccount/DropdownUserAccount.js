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
    border-radius: 5px;
    border: 1px solid ${props => props.theme.color.grey}55;
    box-shadow: 2px 2px 2px ${props => props.theme.color.grey}55;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /*
    visibility: hidden;
    opacity: 0;
    */
    transition: .1s;
    z-index: 20;
    background-color: white;
    color: ${props => props.theme.color.dark};
    visibility: ${props => props.showDropdown ? 'visible' : 'hidden'}
`;

const ListItemDropdown = styled(Link)`
    padding: .6rem .3rem .6rem 1.7rem;
    list-style-type: none;
    display: block;
    color: ${props => props.theme.color.dark};
    font-size: 1.1rem;
    position: relative;
    background-color: white;
    z-index: 2;

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

    }
`;

const ListItemDropdownLi = styled.li`
    z-index: 2;
    padding: .6rem .3rem .6rem 1.7rem;
    list-style-type: none;
    display: block;
    color: ${props => props.theme.color.dark};
    font-size: 1.1rem;
    position: relative;
    cursor: pointer;
    background-color: white;

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

    }
`;


function DropdownUserAccount({ showDropdown, dropdownRef }) {

    const { logout } = useContext(AuthContext);


    return (
        <StyledDropdownUserAccount showDropdown={showDropdown} ref={dropdownRef}>
            <ListItemDropdown to='/perfil'>
                <BiUserCircle />
                <span>Perfil</span>
            </ListItemDropdown>
            <ListItemDropdown to='/'>
                <IoMdNotificationsOutline />
                <span>Notificações</span>
            </ListItemDropdown>
            <ListItemDropdownLi to='' onClick={() => logout()}>
                <AiOutlineLogout />
                <span>Sair</span>
            </ListItemDropdownLi>
        </StyledDropdownUserAccount>
    );
}


export default DropdownUserAccount;

