import styled from 'styled-components';
import React from 'react';
import { BiUserCircle } from 'react-icons/bi';
import { AiOutlineLogout } from 'react-icons/ai';
import { IoMdNotificationsOutline } from 'react-icons/io';

const StyledDropdownUserAccount = styled.div`
    position: absolute;
    top: 75px;
    right: 10px;
    width: 250px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    /*
    visibility: hidden;
    opacity: 0;
    */
    transition: .5s;
    z-index: 2;
    background-color: ${props => props.theme.color.primary};
    color: white;
`;

const ListDropdown = styled.ul`
    padding-left: 0;
    z-index: 55;
`;

const ListItemDropdown = styled.li`
    list-style-type: none;
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    z-index: 55;

    svg{
        width: 20px;
        height: auto;
        margin-right: 5px;
    }

    a {
        text-decoration: none;
        transition: .5s;
        color: #000;

        &:hover {
        color: #ff7171;
    }
}
`;

function DropdownUserAccount(props) {
    return (
        <StyledDropdownUserAccount>
            <ListDropdown>
                <ListItemDropdown>
                    <BiUserCircle />
                    Perfil
                </ListItemDropdown>
                <ListItemDropdown>
                    <IoMdNotificationsOutline />
                    Noficações
                </ListItemDropdown>
                <ListItemDropdown>
                    <AiOutlineLogout />
                    Sair
                </ListItemDropdown>
            </ListDropdown>
        </StyledDropdownUserAccount>
    );
}


export default DropdownUserAccount;

