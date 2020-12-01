import styled from 'styled-components';
import React from 'react';

const StyledDropdownUserAccount = styled.div`
    position: relative;
    margin: 0 auto;
    padding: 30px 50px;
    width: 300px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    margin-top: 50px;
    /*
    visibility: hidden;
    opacity: 0;
    */
    transition: .5s;
    z-index: 2;
    border: 1px solid black;
    background-color: blue;
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
                    Perfil
                </ListItemDropdown>
                <ListItemDropdown>
                    Perfil
                </ListItemDropdown>
            </ListDropdown>
        </StyledDropdownUserAccount>
    );
}


export default DropdownUserAccount;

