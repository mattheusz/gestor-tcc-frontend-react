import React from 'react';
import styled from 'styled-components'
import IFFLogo from '../assets/iff.png'


function HeaderDefault(props) {
    return (
        <Header>
            <figure>
                <Logo src={IFFLogo} alt="IFF logo" />
            </figure>
        </Header>
    );
}

export default HeaderDefault;

const Header = styled.header`
    height: 140px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const Logo = styled.img`
    width: 100px;
    height: auto;
`
/*
const Title = styled.h1`
    text-align: center;
    margin: .3rem auto .5rem;
    font-size: 2.2rem;
    font-weight: 200;
    color: ${props => props.theme.color.primary};
    font-weight: 300;

    span {
        color: ${props => props.theme.color.secondary};
        font-weight: 600;
    }
`
*/